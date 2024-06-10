import type { Request } from 'express';

import validateLensToken from './validateLensToken';

/**
 * Middleware to validate Lens account
 * @param request Incoming request
 * @returns Response
 */
const validateLensAccount = async (
  request: Request
): Promise<200 | 400 | 401 | 500> => {
  const identityToken = request.headers['x-identity-token'] as string;
  const network = request.headers['x-lens-network'] as string;
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!identityToken || !network || !allowedNetworks.includes(network)) {
    return 400;
  }

  return await validateLensToken(identityToken, network);
};

export default validateLensAccount;
