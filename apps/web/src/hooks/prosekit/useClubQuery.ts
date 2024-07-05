import type { Club } from '@hey/types/club';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type ClubProfile = {
  handle: string;
  id: string;
  name: string;
  picture: string;
};

const useClubQuery = (query: string): ClubProfile[] => {
  const [results, setResults] = useState<ClubProfile[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    axios
      .post(
        `${HEY_API_URL}/clubs/get`,
        { club_handle: query, limit: 10 },
        { headers: getAuthApiHeaders() }
      )
      .then(({ data }) => {
        const search = data.data;
        const clubSearchResult = search;
        const clubs = clubSearchResult?.items as Club[];
        const clubsResults = (clubs ?? []).map(
          (club): ClubProfile => ({
            handle: club.handle,
            id: club.id,
            name: club.name,
            picture: club.logo
          })
        );

        setResults(clubsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
      });
  }, [query]);

  return results;
};

export default useClubQuery;
