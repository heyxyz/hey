import type { Context } from '@gql/builder';
import { parseJwt } from 'lens/apollo/lib';

const getAddressFromJwt = (context: Context): string => {
  if (!context.req.headers.authorization) {
    throw new Error('No authorization header');
  }

  const decoded = parseJwt(context.req.headers.authorization);
  console.log(decoded);

  return decoded.id;
};

export default getAddressFromJwt;
