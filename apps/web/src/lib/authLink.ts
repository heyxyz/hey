import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { API_URL } from '@lenster/data/constants';
import { parseJwt } from '@lenster/lens/apollo/lib';
import axios from 'axios';
import { hydrateAuthTokens, signIn, signOut } from 'src/store/auth';

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();
  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const willExpireSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;
  if (!willExpireSoon) {
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
      }
    });
    return forward(operation);
  }
  return fromPromise(
    axios
      .post(
        API_URL,
        JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken }
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(({ data: result }) => {
        operation.setContext({
          headers: {
            'x-access-token': `Bearer ${result?.data?.refresh?.accessToken}`
          }
        });
        signIn({
          accessToken: result?.data?.refresh?.accessToken,
          refreshToken: result?.data?.refresh?.refreshToken
        });
        return toPromise(forward(operation));
      })
      .catch(() => {
        signOut();
        location.reload();

        return toPromise(forward(operation));
      })
  );
});

export default authLink;
