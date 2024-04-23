import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get the score for a profile
 * @param id Profile ID
 * @returns Hey score
 */
const getScore = async (id: string): Promise<number> => {
  try {
    const response: { data: { score: number } } = await axios.get(
      `${HEY_API_URL}/lens/score`,
      { params: { id } }
    );

    return response.data.score || 0;
  } catch {
    return 0;
  }
};

export default getScore;
