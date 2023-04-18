import type { Context } from '@gql/builder';
import { parseJwt } from 'lens/apollo/lib';

/**
 * Get the address from the JWT
 * @param context The pothos context object
 * @returns The address
 */
const getAddressFromJwt = (context: Context): string => {
  const decoded = parseJwt(context.req.headers.authorization as string);

  return decoded.id;
};

export default getAddressFromJwt;
