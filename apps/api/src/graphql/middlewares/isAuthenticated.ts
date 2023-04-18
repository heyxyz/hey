import type { Context } from '@gql/builder';
import { VerifyDocument } from 'lens';
import { nodeClient } from 'lens/apollo';

const isAuthenticated = async (context: Context) => {
  if (!context.req.headers.authorization) {
    throw new Error('No authorization header provided');
  }

  const { data } = await nodeClient.query({
    query: VerifyDocument,
    variables: { request: { accessToken: context.req.headers.authorization } }
  });

  if (!data.verify) {
    throw new Error('Invalid authorization token');
  }
};

export default isAuthenticated;
