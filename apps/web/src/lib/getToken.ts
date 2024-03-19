import { HEY_API_URL } from '@hey/data/constants';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';

interface FunctionResult {
  error?: any;
  result?: number | string;
  status: 'failure' | 'success';
}

interface TokenResponse {
  result: [FunctionResult, FunctionResult, FunctionResult];
  success: boolean;
}

export interface TokenInfo {
  decimals?: number;
  name: string;
  symbol: string;
}

const getToken = async (tokenAddress: string): Promise<false | TokenInfo> => {
  try {
    const res = await axios.get<TokenResponse>(`${HEY_API_URL}/tokens/get`, {
      headers: getAuthApiHeaders(),
      params: { tokenAddress }
    });

    const tokenInfo: TokenInfo = {
      name: res.data.result[0].result as string,
      symbol: res.data.result[1].result as string
    };

    if (res.data.result[2].status === 'success') {
      tokenInfo.decimals = res.data.result[2].result as number;
    }

    return tokenInfo;
  } catch (error) {
    return false;
  }
};

export default getToken;
