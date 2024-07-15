import { IS_MAINNET } from '@hey/data/constants';

/**
 * Get the number of views of a publication
 * @param ids The ids of the publications
 * @returns The number of views of the publication
 */
// eslint-disable-next-line require-await
const getPublicationsViews = async (ids: string[]): Promise<any[]> => {
  if (!IS_MAINNET) {
    return [];
  }

  try {
    return [];
  } catch {
    return [];
  }
};

export default getPublicationsViews;
