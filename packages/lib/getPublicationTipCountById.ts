import type { TipsCount } from '@hey/types/hey';

/**
 * Get the number of tips of a publication
 * @param tips The tips of the publications
 * @param id The publication id
 * @returns The number of tips of the publication
 */
const getPublicationTipCountById = (tips: TipsCount[], id: string) => {
  return tips.find((v) => v.publicationId === id)?.tips || 0;
};

export default getPublicationTipCountById;
