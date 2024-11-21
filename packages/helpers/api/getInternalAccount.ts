import { HEY_API_URL } from "@hey/data/constants";
import type { InternalProfile } from "@hey/types/hey";
import axios from "axios";

export const GET_INTERNAL_ACCOUNT_QUERY_KEY = "getInternalAccount";

/**
 * Get internal profile
 * @param id profile id
 * @param headers auth headers
 * @returns internal profile
 */
const getInternalAccount = async (
  id: string,
  headers: any
): Promise<InternalProfile> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/internal/profile/get`, {
      headers,
      params: { id }
    });

    return data.result;
  } catch {
    return {
      appIcon: 0,
      email: null,
      emailVerified: false,
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false,
      developerMode: false,
      permissions: [],
      mutedWords: [],
      theme: null
    };
  }
};

export default getInternalAccount;
