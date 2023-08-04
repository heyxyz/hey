import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { API_URL } from '@lenster/data/constants';
import { Cookie, Localstorage } from '@lenster/data/storage';
import axios from 'axios';
import Cookies from 'js-cookie';

import { parseJwt } from './lib';

const resetAuthData = () => {
  localStorage.removeItem(Localstorage.ModeStore);
  localStorage.removeItem(Localstorage.NotificationStore);
  localStorage.removeItem(Localstorage.TransactionStore);
  localStorage.removeItem(Localstorage.TimelineStore);
  localStorage.removeItem(Localstorage.MessageStore);
  localStorage.removeItem(Localstorage.AttachmentCache);
  localStorage.removeItem(Localstorage.AttachmentStore);
  localStorage.removeItem(Localstorage.NonceStore);
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
  const accessToken = Cookies.get(Cookie.AccessToken);
  const refreshToken = Cookies.get(Cookie.RefreshToken);

  if (!accessToken || !refreshToken) {
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
        Cookies.set(Cookie.AccessToken, accessToken);
        Cookies.set(Cookie.RefreshToken, refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        resetAuthData();
        location.reload();

        return toPromise(forward(operation));
      })
  );
});

export default authLink;
