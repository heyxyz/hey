import LensEndpoint from '@hey/data/lens-endpoints';
import axios from 'axios';

import { HEY_USER_AGENT } from '../constants';

/**
 * Middleware to validate Lens identity token for connections
 * @param identityToken Incoming identity token
 * @param network Incoming network
 * @returns Response
 */
const validateLensIdentityToken = async (
  identityToken: string,
  network: string
): Promise<200 | 400 | 401 | 500> => {
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!identityToken || !network || !allowedNetworks.includes(network)) {
    return 400;
  }

  const isMainnet = network === 'mainnet';
  try {
    const { data } = await axios.post(
      isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
      {
        query: `
          query Verify {
            verify(request: { identityToken: "${identityToken}" })
          }
        `
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-agent': HEY_USER_AGENT
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

export default validateLensIdentityToken;
