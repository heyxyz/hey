import type { Club } from '@hey/types/club';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

export interface Payload {
  club_handle?: null | string;
  id?: null | string;
  limit?: null | number;
  profile_id?: null | string;
  query?: null | string;
  skip?: null | number;
}

const getClubs = async (
  payload: Payload,
  headers: any
): Promise<[] | Club[]> => {
  try {
    const response = await axios.post(`${HEY_API_URL}/clubs/get`, payload, {
      headers
    });

    return response.data.data.items;
  } catch {
    return [];
  }
};

export default getClubs;
