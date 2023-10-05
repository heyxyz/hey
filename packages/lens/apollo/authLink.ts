import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { API_URL } from '@hey/data/constants';
import { CookieData } from '@hey/data/storage';
import axios from 'axios';
import Cookies from 'js-cookie';

import { parseJwt } from './lib';

const resetAuthData = () => {
  // Remove cookies data
  Cookies.remove(CookieData.ModeStore);
  Cookies.remove(CookieData.NotificationStore);
  Cookies.remove(CookieData.TransactionStore);
  Cookies.remove(CookieData.TimelineStore);
  Cookies.remove(CookieData.MessageStore);
  Cookies.remove(CookieData.AttachmentCache);
  Cookies.remove(CookieData.AttachmentStore);
  Cookies.remove(CookieData.NonceStore);
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
  const accessToken = Cookies.get(CookieData.AccessToken);
  const refreshToken = Cookies.get(CookieData.RefreshToken);

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
        const newAccessToken = data?.data?.refresh?.accessToken;
        const newRefreshToken = data?.data?.refresh?.refreshToken;
        operation.setContext({
          headers: { 'x-access-token': `Bearer ${newAccessToken}` }
        });

        // Use Cookies.set() with secure and sameSite attributes
        Cookies.set(CookieData.AccessToken, newAccessToken, {
          secure: true,
          sameSite: 'strict'
        });
        Cookies.set(CookieData.RefreshToken, newRefreshToken, {
          secure: true,
          sameSite: 'strict'
        });

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
