import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { API_URL } from '@hey/data/constants';
import { CookiesKeys, cookieStorage } from '@hey/data/cookieStorage';
import axios from 'axios';

import { parseJwt } from './lib';

const resetAuthData = () => {
  cookieStorage.removeItem(CookiesKeys.ModeStore);
  cookieStorage.removeItem(CookiesKeys.NotificationStore);
  cookieStorage.removeItem(CookiesKeys.TransactionStore);
  cookieStorage.removeItem(CookiesKeys.TimelineStore);
  cookieStorage.removeItem(CookiesKeys.MessageStore);
  cookieStorage.removeItem(CookiesKeys.AttachmentCache);
  cookieStorage.removeItem(CookiesKeys.AttachmentStore);
  cookieStorage.removeItem(CookiesKeys.NonceStore);
};

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = cookieStorage.getItem(CookiesKeys.AccessToken);
  const refreshToken = cookieStorage.getItem(CookiesKeys.RefreshToken);

  if (!accessToken || accessToken === 'undefined') {
    resetAuthData();
    return forward(operation);
  }

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!expiringSoon) {
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
          headers: { 'x-access-token': `Bearer ${accessToken}` }
        });

        cookieStorage.setItem(CookiesKeys.AccessToken, accessToken);
        cookieStorage.setItem(CookiesKeys.RefreshToken, refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
