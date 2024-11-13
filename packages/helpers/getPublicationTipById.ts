import type { PostTip } from "@hey/types/hey";

/**
 * Get the tip object of a publication
 * @param tips The tips of the publications
 * @param id The publication id
 * @returns The tip object of the publication
 */
const getPublicationTipById = (tips: PostTip[], id: string) => {
  return tips.find((v) => v.id === id);
};

export default getPublicationTipById;
