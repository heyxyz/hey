import type { NextLink, Operation } from '@apollo/client';

import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { APP_NAME, LENS_API_URL } from '@hey/data/constants';
import parseJwt from '@hey/helpers/parseJwt';
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

const setHeaders = (operation: Operation, accessToken?: string) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(accessToken ? { 'X-Access-Token': accessToken } : {}),
      'X-Requested-From': APP_NAME.toLowerCase(),
      'X-Requested-Id': uuid()
    }
  }));
};

const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
  const { accessToken, refreshToken } = hydrateAuthTokens();

  if (!accessToken || !refreshToken) {
    signOut();
    setHeaders(operation);
    return forward(operation);
  }

  const isExpiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!isExpiringSoon) {
    setHeaders(operation, accessToken);
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
        const { accessToken, identityToken, refreshToken } =
          data?.data?.refresh;
        signIn({ accessToken, identityToken, refreshToken });
        setHeaders(operation, accessToken);
        return toPromise(forward(operation));
      })
      .catch(() => {
        signOut();
        setHeaders(operation);
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
