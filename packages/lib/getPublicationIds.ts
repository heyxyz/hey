import { FEEDS_WORKER_URL } from '@lenster/data/constants';
import axios from 'axios';

/**
 * Get the publication ids for a given provider and strategy from an algorithm
 * @param provider algorithm provider
 * @param strategy algorithm strategy
 * @returns The publication ids
 */
const getPublicationIds = async (provider: string, strategy: string) => {
  try {
    const response = await axios(`${FEEDS_WORKER_URL}/ids`, {
      params: { provider, strategy }
    });

    return response.data.success ? response.data.ids : [];
  } catch {
    return [];
  }
};

export default getPublicationIds;
