import { ApolloLink, fromPromise, toPromise } from '@apollo/client';
import { API_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import parseJwt from '@hey/lib/parseJwt';
import axios from 'axios';

const resetAuthData = () => {
  localStorage.removeItem(Localstorage.AppStore);
  localStorage.removeItem(Localstorage.ModeStore);
  localStorage.removeItem(Localstorage.NotificationStore);
  localStorage.removeItem(Localstorage.TransactionStore);
  localStorage.removeItem(Localstorage.TimelineStore);
  localStorage.removeItem(Localstorage.AttachmentStore);
  localStorage.removeItem(Localstorage.NonceStore);
  localStorage.removeItem(Localstorage.AccessToken);
  localStorage.removeItem(Localstorage.RefreshToken);
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
  const accessToken = localStorage.getItem(Localstorage.AccessToken);
  const refreshToken = localStorage.getItem(Localstorage.RefreshToken);

  if (!accessToken || accessToken === 'undefined') {
    resetAuthData();
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
          headers: { 'X-Access-Token': `Bearer ${accessToken}` }
        });

        localStorage.setItem(Localstorage.AccessToken, accessToken);
        localStorage.setItem(Localstorage.RefreshToken, refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export default authLink;
