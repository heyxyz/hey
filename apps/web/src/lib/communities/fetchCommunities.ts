import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import type { Community } from '@lenster/types/communities';
import axios from 'axios';

/**
 * Fetches all communities for a profile
 * @param profileId The id of the profile
 * @returns The communities
 */
const fetchCommunities = async (
  profileId: string
): Promise<Community[] | null> => {
  try {
    const response = await axios(
      `${COMMUNITIES_WORKER_URL}/getCommunities/${profileId}/0`
    );

    return response.data;
  } catch (error) {
    return null;
  }
};

export default fetchCommunities;
