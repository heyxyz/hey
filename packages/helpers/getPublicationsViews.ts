import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
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
    const response = await axios.post(
      `${HEY_API_URL}/stats/publication/views`,
      { ids }
    );

    return response.data?.views;
  } catch {
    return [];
  }
};

export default getPublicationsViews;
