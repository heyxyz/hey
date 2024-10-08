import { HEY_API_URL } from "@hey/data/constants";
import type { InternalProfile } from "@hey/types/hey";
import axios from "axios";

/**
 * Get internal profile
 * @param id profile id
 * @param headers auth headers
 * @returns internal profile
 */
const getInternalProfile = async (
  id: string,
  headers: any
): Promise<InternalProfile> => {
  try {
    const response: { data: { result: InternalProfile } } = await axios.get(
      `${HEY_API_URL}/internal/profile/get`,
      { headers, params: { id } }
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

export default getInternalProfile;
