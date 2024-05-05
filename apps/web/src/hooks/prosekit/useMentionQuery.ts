import type { Profile, ProfileSearchRequest } from '@hey/lens';

import getAvatar from '@hey/helpers/getAvatar';
import getProfile from '@hey/helpers/getProfile';
import { LimitType, useSearchProfilesLazyQuery } from '@hey/lens';
import { useEffect, useState } from 'react';

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionProfile = {
  displayHandle: string;
  handle: string;
  id: string;
  name: string;
  picture: string;
};

const useMentionQuery = (query: string): MentionProfile[] => {
  const [results, setResults] = useState<MentionProfile[]>([]);
  const [searchProfiles] = useSearchProfilesLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const request: ProfileSearchRequest = {
      limit: LimitType.Ten,
      query
    };

    searchProfiles({ variables: { request } }).then(({ data }) => {
      if (cancelled) {
        return;
      }

      const search = data?.searchProfiles;
      const profileSearchResult = search;
      const profiles = profileSearchResult?.items as Profile[];
      const profilesResults = (profiles ?? []).map(
        (profile): MentionProfile => ({
          displayHandle: getProfile(profile).slugWithPrefix,
          handle: getProfile(profile).slug,
          id: profile?.id,
          name: getProfile(profile).displayName,
          picture: getAvatar(profile)
        })
      );
      setResults(profilesResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });

    return () => {
      cancelled = true;
    };
  }, [query, searchProfiles]);

  return results;
};

export default useMentionQuery;
