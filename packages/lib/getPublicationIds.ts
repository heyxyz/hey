import { FEEDS_WORKER_URL } from '@lenster/data/constants';
import axios from 'axios';

/**
 * Get the publication ids for a given provider and strategy from an algorithm
 * @param provider algorithm provider
 * @param strategy algorithm strategy
 * @param profile The profile (lens id or handle) to get the feed for
 * @returns The publication ids
 */
const getPublicationIds = async (
  provider: string,
  strategy: string,
  profile?: string
) => {
  try {
    const response = await axios(`${FEEDS_WORKER_URL}/ids`, {
      params: { provider, strategy, ...(profile ? { profile } : {}) }
    });

    return response.data.success ? response.data.ids : [];
  } catch {
    return [];
  }
};

export default getPublicationIds;
