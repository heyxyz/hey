import { HEY_API_URL } from "@hey/data/constants";
import type { ProfileDetails } from "@hey/types/hey";
import axios from "axios";

export const GET_ACCOUNT_DETAILS_QUERY_KEY = "getAccountDetails";

/**
 * Get profile details
 * @param id profile id
 * @returns profile details
 */
const getAccountDetails = async (
  id: string
): Promise<null | ProfileDetails> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/profile/get`, {
      params: { id }
    });

    return data.result;
  } catch {
    return null;
  }
};

export default getAccountDetails;
