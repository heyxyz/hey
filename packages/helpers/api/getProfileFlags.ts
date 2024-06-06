import type { ProfileDetails } from '@good/types/good';

import { GOOD_API_URL } from '@good/data/constants';
import axios from 'axios';

/**
 * Get profile details
 * @param id profile id
 * @returns profile details
 */
const getProfileDetails = async (
  id: string
): Promise<null | ProfileDetails> => {
  try {
    const response = await axios.get(`${GOOD_API_URL}/profile/get`, {
      params: { id }
    });

    return response.data.result;
  } catch {
    return null;
  }
};

export default getProfileDetails;
