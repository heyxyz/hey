import { ALGORITHMS_WORKER_URL } from '@lenster/data/constants';
import axios from 'axios';

const getPublicationIds = async (provider: string, strategy: string) => {
  try {
    const response = await axios(`${ALGORITHMS_WORKER_URL}/publicationIds`, {
      params: { provider, strategy }
    });

    return response.data.success ? response.data.ids : [];
  } catch {
    return [];
  }
};

export default getPublicationIds;
