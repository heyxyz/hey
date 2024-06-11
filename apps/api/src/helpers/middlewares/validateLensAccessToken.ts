import LensEndpoint from '@good/data/lens-endpoints';
import axios from 'axios';

import { GOOD_USER_AGENT } from '../constants';

/**
 * Middleware to validate Lens access token for connections
 * @param accessToken Incoming access token
 * @param network Incoming network
 * @returns Response
 */
const validateLensAccessToken = async (
  accessToken: string,
  network: string
): Promise<200 | 400 | 401 | 500> => {
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!accessToken || !network || !allowedNetworks.includes(network)) {
    return 400;
  }

  const isMainnet = network === 'mainnet';
  try {
    const { data } = await axios.post(
      isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
      {
        query: `
          query Verify {
            verify(request: { accessToken: "${accessToken}" })
          }
        `
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-agent': GOOD_USER_AGENT
        }
      }
    );

    if (data.data.verify) {
      return 200;
    }

    return 401;
  } catch {
    return 500;
  }
};

export default validateLensAccessToken;
