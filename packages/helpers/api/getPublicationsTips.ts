import type { PublicationTip } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get the number of tips of a publication
 * @param ids The ids of the publications
 * @param headers auth headers
 * @returns The number of tips of the publication
 */
const getPublicationsTips = async (
  ids: string[],
  headers: any
): Promise<PublicationTip[]> => {
  try {
    const response = await axios.post(
      `${HEY_API_URL}/tips/get`,
      { ids },
      { headers }
    );

    return response.data?.result || [];
  } catch {
    return [];
  }
};

export default getPublicationsTips;
