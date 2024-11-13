import type { PostTip } from "@hey/types/hey";

/**
 * Get the tip object of a post
 * @param tips The tips of the posts
 * @param id The post id
 * @returns The tip object of the post
 */
const getPostTipById = (tips: PostTip[], id: string) => {
  return tips.find((v) => v.id === id);
};

export default getPostTipById;
