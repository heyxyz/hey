import { HEY_API_URL } from "@hey/data/constants";
import type { InternalAccount } from "@hey/types/hey";
import axios from "axios";

export const GET_INTERNAL_ACCOUNT_QUERY_KEY = "getInternalAccount";

/**
 * Get internal account
 * @param id account id
 * @param headers auth headers
 * @returns internal account
 */
const getInternalAccount = async (
  id: string,
  headers: any
): Promise<InternalAccount> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/internal/account/get`, {
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
