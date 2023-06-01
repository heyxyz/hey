import { ENS_RESOLVER_WORKER_URL } from '@lenster/data';
import axios from 'axios';

export const resolveEns = async (addresses: string[]) => {
  const response = await axios(ENS_RESOLVER_WORKER_URL, {
    method: 'POST',
    data: JSON.stringify({
      addresses: addresses.map((address) => {
        return address.split('/')[0];
      })
    })
  });
  return response.data;
};
