import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import type { Community } from '@lenster/types/communities';
import axios from 'axios';

/**
 * Fetches a community by its slug
 * @param slug The slug of the community
 * @returns The community
 */
const fetchCommunity = async (slug: string): Promise<Community | null> => {
  try {
    const response = await axios(
      `${COMMUNITIES_WORKER_URL}/getCommunityBySlug/${slug}`
    );

    return response.data;
  } catch (error) {
    return null;
  }
};

export default fetchCommunity;
