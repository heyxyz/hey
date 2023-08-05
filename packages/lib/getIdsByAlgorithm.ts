import { ALGORITHMS_WORKER_URL } from '@lenster/data/constants';
import axios from 'axios';

const getIdsByAlgorithm = async (provider: string, strategy: string) => {
  try {
    const response = await axios(
      `${ALGORITHMS_WORKER_URL}/${provider}/${strategy}/50/0`
    );

    return response.data.success ? response.data.ids : [];
  } catch {
    return [];
  }
};

export default getIdsByAlgorithm;
