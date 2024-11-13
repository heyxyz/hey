import type { PostViewCount } from "@hey/types/hey";

/**
 * Get the number of views of a publication
 * @param views The views of the publications
 * @param id The publication id
 * @returns The number of views of the publication
 */
const getPublicationViewCountById = (views: PostViewCount[], id: string) => {
  return views.find((v) => v.id === id)?.views || 0;
};

export default getPublicationViewCountById;
