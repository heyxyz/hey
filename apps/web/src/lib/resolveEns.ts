import { ENS_WORKER_URL } from '@hey/data/constants';
import axios from 'axios';

export const resolveEns = async (addresses: string[]) => {
  try {
    const response = await axios.post(ENS_WORKER_URL, {
      addresses: addresses.map((address) => address.split('/')[0])
    });
    return response.data;
  } catch {
    return [];
  }
};
