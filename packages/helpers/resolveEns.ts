import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

export const resolveEns = async (addresses: string[]) => {
  try {
    const response = await axios.post(`${HEY_API_URL}/ens`, {
      addresses: addresses.map((address) => address.split('/')[0])
    });
    return response.data;
  } catch {
    return [];
  }
};
