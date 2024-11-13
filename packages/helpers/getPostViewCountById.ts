import type { PostViewCount } from "@hey/types/hey";

/**
 * Get the number of views of a post
 * @param views The views of the posts
 * @param id The post id
 * @returns The number of views of the post
 */
const getPostViewCountById = (views: PostViewCount[], id: string) => {
  return views.find((v) => v.id === id)?.views || 0;
};

export default getPostViewCountById;
