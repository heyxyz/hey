import type { Context } from '@gql/builder';
import { parseJwt } from 'lens/apollo/lib';

/**
 * Get the address from the JWT
 * @param context The pothos context object
 * @returns The address
 */
const getAddressFromJwt = (context: Context): string => {
  if (!context.req.headers.authorization) {
    throw new Error('No authorization header');
  }
  const decoded = parseJwt(context.req.headers.authorization);

  return decoded.id;
};

export default getAddressFromJwt;
