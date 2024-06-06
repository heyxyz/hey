import type { AllowedToken } from '@good/types/good';

import { GOOD_API_URL } from '@good/data/constants';
import axios from 'axios';

/**
 * Get all allowed tokens
 * @returns all allowed tokens
 */
const getAllTokens = async (): Promise<AllowedToken[]> => {
  try {
    const response = await axios.get(`${GOOD_API_URL}/tokens/all`);
    const { data } = response;

    return data?.tokens || [];
  } catch {
    return [];
  }
};

export default getAllTokens;
