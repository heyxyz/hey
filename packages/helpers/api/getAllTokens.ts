import type { AllowedToken } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get all allowed tokens
 * @returns all allowed tokens
 */
const getAllTokens = async (): Promise<AllowedToken[]> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/tokens/all`);
    const { data } = response;

    return data?.tokens || [];
  } catch {
    return [];
  }
};

export default getAllTokens;
