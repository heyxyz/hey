import { API_URL } from '@hey/data/constants';
import {
  AuthorizationRecordRevokedDocument,
  NewNotificationDocument,
  type Notification,
  type UserSigNonces,
  UserSigNoncesDocument
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
import { useEffectOnce, useInterval, useUpdateEffect } from 'usehooks-ts';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const { address } = useAccount();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  );

  useEffectOnce(() => {
    sendJsonMessage({ type: 'connection_init' });
  });

  useInterval(() => {
    sendJsonMessage({ type: 'connection_init' });
  }, 10000);

  useUpdateEffect(() => {
    if (readyState === 1 && currentSessionProfileId && address) {
      sendJsonMessage({
        id: '1',
        type: 'start',
        payload: {
          variables: { for: currentSessionProfileId },
          query: NewNotificationDocument
        }
      });
      sendJsonMessage({
        id: '2',
        type: 'start',
        payload: { variables: { address }, query: UserSigNoncesDocument }
      });
      sendJsonMessage({
        id: '3',
        type: 'start',
        payload: {
          variables: { authorizationId: getCurrentSessionId() },
          query: AuthorizationRecordRevokedDocument
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
      }
      if (jsonData.id === '3') {
        signOut();
        location.reload();
      }
    }
  }, [lastMessage]);

  // Sync zustand stores between tabs
  if (isSupported()) {
    share('lensHubOnchainSigNonce', useNonceStore);
  }

  return null;
};

export default LensSubscriptionsProvider;
