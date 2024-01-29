import type { Feature } from '@hey/types/hey';

import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

/**
 * Get all kill switches
 * @param headers auth headers
 * @param callbackFn callback function
 * @returns all kill switches
 */
const getAllKillSwitches = async (
  headers: any,
  callbackFn?: (flags: Feature[]) => void
): Promise<Feature[]> => {
  const response = await axios.get(
    `${HEY_API_URL}/internal/features/switches`,
    { headers }
  );
  const { data } = response;
  callbackFn?.(data?.switches || []);

  return data?.switches || [];
};

export default getAllKillSwitches;
