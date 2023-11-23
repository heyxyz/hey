import { API_URL } from '@hey/data/constants';
import {
  AuthorizationRecordRevokedSubscriptionDocument,
  NewNotificationSubscriptionDocument,
  type Notification,
  type UserSigNonces,
  UserSigNoncesSubscriptionDocument,
  useUserSigNoncesQuery
} from '@hey/lens';
import { BrowserPush } from '@lib/browserPush';
import getCurrentSession from '@lib/getCurrentSession';
import getPushNotificationData from '@lib/getPushNotificationData';
import { type FC } from 'react';
import useWebSocket from 'react-use-websocket';
import { isSupported, share } from 'shared-zustand';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { signOut } from 'src/store/persisted/useAuthStore';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';
import { useEffectOnce, useInterval, useUpdateEffect } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const setLatestNotificationId = useNotificationStore(
    (state) => state.setLatestNotificationId
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const setLensPublicActProxyOnchainSigNonce = useNonceStore(
    (state) => state.setLensPublicActProxyOnchainSigNonce
  );
  const { address } = useAccount();
  const { authorizationId, id: sessionProfileId } = getCurrentSession();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-transport-ws'] }
  );

  useEffectOnce(() => {
    sendJsonMessage({ type: 'connection_init' });
  });

  useInterval(() => {
    sendJsonMessage({ type: 'ping' });
  }, 1000);

  useUpdateEffect(() => {
    if (readyState === 1 && sessionProfileId && address) {
      if (!isAddress(sessionProfileId)) {
        sendJsonMessage({
          id: '1',
          type: 'subscribe',
          payload: {
            variables: { for: sessionProfileId },
            query: NewNotificationSubscriptionDocument.loc?.source.body
          }
        });
      }
      sendJsonMessage({
        id: '2',
        type: 'subscribe',
        payload: {
          variables: { address },
          query: UserSigNoncesSubscriptionDocument.loc?.source.body
        }
      });
      sendJsonMessage({
        id: '3',
        type: 'subscribe',
        payload: {
          variables: { authorizationId },
          query: AuthorizationRecordRevokedSubscriptionDocument.loc?.source.body
        }
      });
    }
  }, [readyState, sessionProfileId]);

  useUpdateEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}');
    const wsData = jsonData?.payload?.data;

    if (sessionProfileId && address && wsData) {
      if (jsonData.id === '1') {
        const notification = wsData.newNotification as Notification;
        if (notification && getPushNotificationData(notification)) {
          const notify = getPushNotificationData(notification);
          BrowserPush.notify({
            title: notify?.title || ''
          });
        }
        setLatestNotificationId(notification?.id);
      }
      if (jsonData.id === '2') {
        const userSigNonces = wsData.userSigNonces as UserSigNonces;
        setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
        setLensPublicActProxyOnchainSigNonce(
          userSigNonces.lensPublicActProxyOnchainSigNonce
        );
      }
      if (jsonData.id === '3') {
        signOut();
        location.reload();
      }
    }
  }, [lastMessage]);

  useUserSigNoncesQuery({
    onCompleted: (data) => {
      setLensPublicActProxyOnchainSigNonce(
        data.userSigNonces.lensPublicActProxyOnchainSigNonce
      );
    },
    skip: Boolean(sessionProfileId) ? !isAddress(sessionProfileId) : true
  });

  // Sync zustand stores between tabs
  if (isSupported()) {
    share('lensHubOnchainSigNonce', useNonceStore);
    share('lensPublicActProxyOnchainSigNonce', useNonceStore);
  }

  return null;
};

export default LensSubscriptionsProvider;
