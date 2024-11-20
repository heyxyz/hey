import isVerified from "@helpers/isVerified";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { Profile, ProfileSearchRequest } from "@hey/lens";
import { LimitType, useSearchProfilesLazyQuery } from "@hey/lens";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionProfile = {
  displayHandle: string;
  handle: string;
  id: string;
  name: string;
  picture: string;
  pqScore: number;
};

const useMentionQuery = (query: string): MentionProfile[] => {
  const [results, setResults] = useState<MentionProfile[]>([]);
  const [searchProfiles] = useSearchProfilesLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const request: ProfileSearchRequest = {
      limit: LimitType.Fifty,
      query
    };

    searchProfiles({ variables: { request } }).then(({ data }) => {
      const search = data?.searchProfiles;
      const profileSearchResult = search;
      const profiles = profileSearchResult?.items as Profile[];
      const profilesResults = (profiles ?? []).map(
        (profile): MentionProfile => ({
          displayHandle: getAccount(profile).slugWithPrefix,
          handle: getAccount(profile).slug,
          id: profile?.id,
          name: getAccount(profile).displayName,
          picture: getAvatar(profile),
          pqScore: profile.stats.lensClassifierScore || 0
        })
      );

      setResults(
        profilesResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT).sort((a, b) => {
          // Convert boolean to number: true -> 1, false -> 0
          const verifiedA = isVerified(a.id) ? 1 : 0;
          const verifiedB = isVerified(b.id) ? 1 : 0;

          // Primary sort by verification status (descending: verified first)
          if (verifiedA !== verifiedB) {
            return verifiedB - verifiedA;
          }

          // Secondary sort by pqScore (descending)
          return b.pqScore - a.pqScore;
        })
      );
    });
  }, [query, searchProfiles]);

  return results;
};

export default useMentionQuery;
