import { HEY_API_URL } from '@hey/data/constants';
import type { Preferences } from '@hey/types/hey';
import axios from 'axios';

/**
 * Get user preferences
 * @param id user id
 * @param headers auth headers
 * @returns user preferences
 */
const getPreferences = async (
  id: string,
  headers: any
): Promise<Preferences> => {
  try {
    const response: { data: { result: Preferences } } = await axios.get(
      `${HEY_API_URL}/preference/getPreferences`,
      { params: { id }, headers }
    );

    return response.data.result;
  } catch {
    return {
      preference: null,
      pro: { enabled: false },
      features: []
    };
  }
};

export default getPreferences;
