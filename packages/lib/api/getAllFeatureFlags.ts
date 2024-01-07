import type { Feature } from '@hey/types/hey';

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
  callbackFn?: (flags: Feature[]) => void
): Promise<Feature[]> => {
  const response = await axios.get(`${HEY_API_URL}/internal/features/all`, {
    headers
  });
  const { data } = response;
  callbackFn?.(data?.features || []);

  return data?.features || [];
};

export default getAllFeatureFlags;
