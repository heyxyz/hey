import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { LENS_API_URL } from '@good/data/constants';
import parseJwt from '@good/helpers/parseJwt';
import axios from 'axios';
import {
  hydrateAuthTokens,
  signIn,
  signOut
} from 'src/store/persisted/useAuthStore';
import { v4 as uuid } from 'uuid';

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
      identityToken
    }
  }
`;

const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  // Set Request ID
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-request-id': uuid()
    }
  }));

  if (!accessToken || !refreshToken) {
    signOut();
    return forward(operation);
  }

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!expiringSoon) {
    operation.setContext({
      headers: { 'X-Access-Token': accessToken || '' }
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
        const identityToken = data?.data?.refresh?.identityToken;
        operation.setContext({ headers: { 'X-Access-Token': accessToken } });
        signIn({ accessToken, identityToken, refreshToken });

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
