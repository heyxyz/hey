import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get Hey score
 * @param address profile wallet address
 * @param headers auth headers
 * @param skipCache skip cache
 * @returns Hey score
 */
const getHeyScore = async (
  address: string,
  headers: any,
  skipCache = false
): Promise<number> => {
  try {
    const response: { data: { result: number } } = await axios.get(
      `${HEY_API_URL}/score/get`,
      { headers, params: { address, skipCache } }
    );

    return response.data.result || 0;
  } catch {
    return 0;
  }
};

export default getHeyScore;
