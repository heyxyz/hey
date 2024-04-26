import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

const FALLBACK_SCORE = {
  expiresAt: new Date(),
  score: 0
};

/**
 * Get the score for a profile
 * @param id Profile ID
 * @returns Hey score
 */
const getScore = async (
  id: string
): Promise<{
  expiresAt: Date;
  score: number;
}> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/score/get`, {
      params: { id }
    });

    return response.data || FALLBACK_SCORE;
  } catch {
    return FALLBACK_SCORE;
  }
};

export default getScore;
