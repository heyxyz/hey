import type { Features } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get all features
 * @param headers auth headers
 * @param callbackFn callback function
 * @returns all features
 */
const getAllFeatureFlags = async (
  headers: any,
  callbackFn?: (flags: Features[]) => void
): Promise<Features[]> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/internal/feature/all`, {
      headers
    });
    const { data } = response;
    callbackFn?.(data?.features || []);

    return data?.features || [];
  } catch (error) {
    throw error;
  }
};

export default getAllFeatureFlags;
