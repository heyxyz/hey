import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

const getPro = async (
  id: string
): Promise<{ isPro: boolean; proExpiresAt: Date | null }> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/pro/get`, {
      params: { id }
    });
    const { data } = response;

    return data?.result;
  } catch {
    return { isPro: false, proExpiresAt: null };
  }
};

export default getPro;
