import type { Request } from 'express';

import validateLensAccessToken from './validateLensAccessToken';

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

  return await validateLensAccessToken(accessToken, network);
};

export default validateLensAccount;
