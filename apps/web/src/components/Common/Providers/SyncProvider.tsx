import { API_URL } from '@hey/data/constants';
import type { Notification, UserSigNonces } from '@hey/lens';
import {
  NewNotificationSubscription,
  UserSigNoncesSubscription
} from '@hey/lens/documents/Subscription';
import type { FC } from 'react';
import useWebSocket from 'react-use-websocket';
import { isSupported, share } from 'shared-zustand';
import { useAppPersistStore } from 'src/store/app';
import { useNonceStore } from 'src/store/useNonceStore';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import { useUpdateEffect } from 'usehooks-ts';
import { useAccount } from 'wagmi';

const SyncProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const { address } = useAccount();
  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );
  const {
    setLensHubOnchainSigNonce,
    setLensTokenHandleRegistryOnchainSigNonce,
    setLensPublicActProxyOnchainSigNonce
  } = useNonceStore();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  );

  useUpdateEffect(() => {
    if (readyState === 1 && profileId && address) {
      sendJsonMessage({
        id: '1',
        type: 'start',
        payload: {
          variables: { for: profileId },
          query: NewNotificationSubscription
        }
      });
      sendJsonMessage({
        id: '2',
        type: 'start',
        payload: { variables: { address }, query: UserSigNoncesSubscription }
      });
    }
  }, [readyState]);

  useUpdateEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}');
    const wsData = jsonData?.payload?.data;

    if (profileId && address && wsData) {
      if (jsonData.id === '1') {
        const notification = wsData.newNotification as Notification;
        setLatestNotificationId(notification.id);
      }
      if (jsonData.id === '2') {
        const userSigNonces = wsData.userSigNonces as UserSigNonces;
        setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
        setLensTokenHandleRegistryOnchainSigNonce(
          userSigNonces.lensTokenHandleRegistryOnchainSigNonce
        );
        setLensPublicActProxyOnchainSigNonce(
          userSigNonces.lensPublicActProxyOnchainSigNonce
        );
      }
    }
  }, [lastMessage]);

  // Sync zustand stores between tabs
  if (isSupported()) {
    share('lensHubOnchainSigNonce', useNonceStore);
    share('lensTokenHandleRegistryOnchainSigNonce', useNonceStore);
    share('lensPublicActProxyOnchainSigNonce', useNonceStore);
  }

  return null;
};

export default SyncProvider;
