import { HEY_API_URL } from '@hey/data/constants';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';

const getBalanceForToken = async (tokenAddress: string, account: string) => {
  try {
    const res = await axios.get(`${HEY_API_URL}/tokens/balance`, {
      headers: getAuthApiHeaders(),
      params: {
        account,
        tokenAddress
      }
    });
    return res.data.result;
  } catch (error) {
    return 0;
  }
};

export default getBalanceForToken;
