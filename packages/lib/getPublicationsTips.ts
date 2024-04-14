import { IS_MAINNET, TIP_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get the number of tips of a publication
 * @param ids The ids of the publications
 * @returns The number of tips of the publication
 */
const getPublicationsTips = async (ids: string[]) => {
  if (!IS_MAINNET) {
    return [];
  }

  try {
    const response = await axios.post(`${TIP_API_URL}/publications`, {
      publicationIds: ids
    });

    return response.data;
  } catch {
    return [];
  }
};

export default getPublicationsTips;
