import type { Preferences } from "@hey/types/hey";

import { HEY_API_URL } from "@hey/data/constants";
import axios from "axios";

/**
 * Get profile preferences
 * @param headers auth headers
 * @returns profile preferences
 */
const getPreferences = async (headers: any): Promise<Preferences> => {
  try {
    const response: { data: { result: Preferences } } = await axios.get(
      `${HEY_API_URL}/preferences/get`,
      { headers }
    );

    return response.data.result;
  } catch {
    return {
      appIcon: 0,
      email: null,
      emailVerified: false,
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false,
      permissions: []
    };
  }
};

export default getPreferences;
