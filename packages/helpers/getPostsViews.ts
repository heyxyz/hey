import { HEY_API_URL, IS_MAINNET } from "@hey/data/constants";
import axios from "axios";

export const GET_POSTS_VIEWS_QUERY_KEY = "getPostsViews";

/**
 * Get the number of views of a post
 * @param ids The ids of the posts
 * @returns The number of views of the post
 */
const getPostsViews = async (
  ids: string[]
): Promise<
  {
    id: string;
    views: number;
  }[]
> => {
  if (!IS_MAINNET) {
    return [];
  }

  try {
    const { data } = await axios.post(`${HEY_API_URL}/stats/post/views`, {
      ids
    });

    return data?.views;
  } catch {
    return [];
  }
};

export default getPostsViews;
