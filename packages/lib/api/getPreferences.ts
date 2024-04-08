import type { Preferences } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get profile preferences
 * @param id profile id
 * @param headers auth headers
 * @returns profile preferences
 */
const getPreferences = async (
  id: string,
  headers: any
): Promise<Preferences> => {
  try {
    const response: { data: { result: Preferences } } = await axios.get(
      `${HEY_API_URL}/preferences/get`,
      { headers, params: { id } }
    );

    return response.data.result;
  } catch {
    return {
      features: [],
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false,
      isPride: false
    };
  }
};

export default getPreferences;
