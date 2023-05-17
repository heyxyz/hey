import { ENS_FETCH_URL } from 'data';

export const resolveEns = async (addresses: string[]) => {
  const response = await fetch(ENS_FETCH_URL, {
    method: 'POST',
    body: JSON.stringify({
      addresses: addresses.map((address) => {
        return address.split('/')[0];
      })
    })
  });
  return await response.json();
};
