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
import getCurrentSessionId from '@lib/getCurrentSessionId';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getPushNotificationData from '@lib/getPushNotificationData';
import { type FC } from 'react';
import useWebSocket from 'react-use-websocket';
import { isSupported, share } from 'shared-zustand';
import { signOut } from 'src/store/useAuthPersistStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const setLensPublicActProxyOnchainSigNonce = useNonceStore(
    (state) => state.setLensPublicActProxyOnchainSigNonce
  );
  const { address } = useAccount();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  );

  useEffectOnce(() => {
    sendJsonMessage({ type: 'connection_init' });
  });

  useUpdateEffect(() => {
    if (readyState === 1 && currentSessionProfileId && address) {
      if (!isAddress(currentSessionProfileId)) {
        sendJsonMessage({
          id: '1',
          type: 'start',
          payload: {
            variables: { for: currentSessionProfileId },
            query: NewNotificationSubscriptionDocument
          }
        });
      }
      sendJsonMessage({
        id: '2',
        type: 'start',
        payload: {
          variables: { address },
          query: UserSigNoncesSubscriptionDocument
        }
      });
      sendJsonMessage({
        id: '3',
        type: 'start',
        payload: {
          variables: { authorizationId: getCurrentSessionId() },
          query: AuthorizationRecordRevokedSubscriptionDocument
        }
      });
    }
  }, [readyState, currentSessionProfileId]);

  useUpdateEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}');
    const wsData = jsonData?.payload?.data;

    if (currentSessionProfileId && address && wsData) {
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
      setLensHubOnchainSigNonce(data.userSigNonces.lensHubOnchainSigNonce);
      setLensPublicActProxyOnchainSigNonce(
        data.userSigNonces.lensPublicActProxyOnchainSigNonce
      );
    },
    skip: !currentSessionProfileId
  });

  // Sync zustand stores between tabs
  if (isSupported()) {
    share('lensHubOnchainSigNonce', useNonceStore);
    share('lensPublicActProxyOnchainSigNonce', useNonceStore);
  }

  return null;
};

export default LensSubscriptionsProvider;
