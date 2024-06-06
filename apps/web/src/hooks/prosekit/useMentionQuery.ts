import type { Profile, ProfileSearchRequest } from '@good/lens';

import getAvatar from '@good/helpers/getAvatar';
import getProfile from '@good/helpers/getProfile';
import { LimitType, useSearchProfilesLazyQuery } from '@good/lens';
import isVerified from '@helpers/isVerified';
import { useEffect, useState } from 'react';

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
          displayHandle: getProfile(profile).slugWithPrefix,
          handle: getProfile(profile).slug,
          id: profile?.id,
          name: getProfile(profile).displayName,
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
