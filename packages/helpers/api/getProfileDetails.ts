import { HEY_API_URL } from "@hey/data/constants";
import type { ProfileDetails } from "@hey/types/hey";
import axios from "axios";

export const GET_PROFILE_DETAILS_QUERY_KEY = "getProfileDetails";

/**
 * Get profile details
 * @param id profile id
 * @returns profile details
 */
const getProfileDetails = async (
  id: string
): Promise<null | ProfileDetails> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/profile/get`, {
      params: { id }
    });

    return response.data.result;
  } catch {
    return null;
  }
};

export default getProfileDetails;
