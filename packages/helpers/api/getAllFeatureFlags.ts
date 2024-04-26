import type { Feature } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get all features
 * @param headers auth headers
 * @returns all features
 */
const getAllFeatureFlags = async (headers: any): Promise<Feature[]> => {
  const response = await axios.get(`${HEY_API_URL}/internal/features/all`, {
    headers
  });
  const { data } = response;

  return data?.features || [];
};

export default getAllFeatureFlags;
