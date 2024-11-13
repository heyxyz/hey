import { HEY_API_URL } from "@hey/data/constants";
import type { PostTip } from "@hey/types/hey";
import axios from "axios";

/**
 * Get the number of tips of a post
 * @param ids The ids of the posts
 * @param headers auth headers
 * @returns The number of tips of the post
 */
const getPostsTips = async (
  ids: string[],
  headers: any
): Promise<PostTip[]> => {
  try {
    const { data } = await axios.post(
      `${HEY_API_URL}/tips/get`,
      { ids },
      { headers }
    );

    return data?.result || [];
  } catch {
    return [];
  }
};

export default getPostsTips;
