import { IS_MAINNET, STATS_WORKER_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get the number of views of a publication
 * @param ids The ids of the publications
 * @returns The number of views of the publication
 */
const getPublicationsViews = async (ids: string[]) => {
  if (!IS_MAINNET) {
    return [];
  }

  try {
    const response = await axios.post(`${STATS_WORKER_URL}/publicationViews`, {
      ids
    });

    return response.data?.views;
  } catch {
    return [];
  }
};

export default getPublicationsViews;
