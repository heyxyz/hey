import { GOOD_API_URL } from '@good/data/constants';
import axios from 'axios';

const getPro = async (
  id: string
): Promise<{ expiresAt: Date | null; isPro: boolean }> => {
  try {
    const response = await axios.get(`${GOOD_API_URL}/pro/get`, {
      params: { id }
    });
    const { data } = response;

    return data?.result;
  } catch {
    return { expiresAt: null, isPro: false };
  }
};

export default getPro;
