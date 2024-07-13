import type { Club } from '@hey/types/club';

import getClubs from '@hey/helpers/api/clubs/getClubs';
import { useEffect, useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import useLensAuthData from '../useLensAuthData';

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type ClubProfile = {
  displayHandle: string;
  handle: string;
  id: string;
  name: string;
  picture: string;
};

const useClubQuery = (query: string): ClubProfile[] => {
  const { currentProfile } = useProfileStore();
  const [results, setResults] = useState<ClubProfile[]>([]);
  const lensAuthData = useLensAuthData();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    getClubs(
      { limit: 10, profile_id: currentProfile?.id, query },
      lensAuthData
    ).then((data) => {
      const clubs = data as Club[];
      const clubsResults = (clubs ?? []).map(
        (club): ClubProfile => ({
          displayHandle: `/${club.handle}`,
          handle: club.handle,
          id: club.id,
          name: club.name,
          picture: club.logo
        })
      );

      setResults(clubsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return results;
};

export default useClubQuery;
