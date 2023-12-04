import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { LENS_API_URL } from '@hey/data/constants';
import parseJwt from '@hey/lib/parseJwt';
import axios from 'axios';
import {
  hydrateAuthTokens,
  signIn,
  signOut
} from 'src/store/persisted/useAuthStore';

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

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!expiringSoon) {
    operation.setContext({
      headers: {
        'X-Access-Token': accessToken ? `Bearer ${accessToken}` : ''
      }
    });

    return forward(operation);
  }

  return fromPromise(
    axios
      .post(
        LENS_API_URL,
        {
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: { request: { refreshToken } }
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken;
        const refreshToken = data?.data?.refresh?.refreshToken;
        operation.setContext({
          headers: { 'X-Access-Token': `Bearer ${accessToken}` }
        });
        signIn({ accessToken, refreshToken });

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
