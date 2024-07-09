import type { NextFunction, Request, Response } from 'express';

import { Errors } from '@hey/data';
import LensEndpoint from '@hey/data/lens-endpoints';
import axios from 'axios';

import catchedError from '../catchedError';
import { HEY_USER_AGENT } from '../constants';

/**
 * Middleware to validate Lens account
 * @param request Incoming request
 * @returns Response
 */
const validateLensAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const identityToken = req.headers['x-identity-token'] as string;
  const network = req.headers['x-lens-network'] as string;
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!identityToken || !network || !allowedNetworks.includes(network)) {
    return catchedError(res, new Error(Errors.Unauthorized), 401);
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
      return next();
    }

    return catchedError(res, new Error(Errors.Unauthorized), 401);
  } catch {
    return catchedError(res, new Error(Errors.SomethingWentWrong));
  }
};

export default validateLensAccount;
