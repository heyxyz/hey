import type { Request } from 'express';

import LensEndpoint from '@hey/data/lens-endpoints';
import axios from 'axios';

/**
 * Middleware to validate Lens access token
 * @param request Incoming request
 * @returns Response
 */
const validateLensAccount = async (
  request: Request
): Promise<200 | 400 | 401 | 500> => {
  const accessToken = request.headers['x-access-token'] as string;
  const network = request.headers['x-lens-network'] as string;
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
          'User-agent': 'Hey.xyz'
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

export default validateLensAccount;
