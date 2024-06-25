import type { Notification } from '@hey/lens';
import type { FC } from 'react';

import { BrowserPush } from '@helpers/browserPush';
import getCurrentSession from '@helpers/getCurrentSession';
import getPushNotificationData from '@helpers/getPushNotificationData';
import {
  useNewNotificationSubscriptionSubscription,
  useUserSigNoncesSubscriptionSubscription
} from '@hey/lens';
import { useEffect } from 'react';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const { setLatestNotificationId } = useNotificationStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && Boolean(address);

  // New Notification Subscription
  const { data: newNotificationData } =
    useNewNotificationSubscriptionSubscription({
      skip: !canUseSubscriptions,
      variables: { for: sessionProfileId }
    });

  useEffect(() => {
    if (newNotificationData?.newNotification) {
      const notification = newNotificationData.newNotification as Notification;

      const notify = getPushNotificationData(notification);
      if (notify) {
        BrowserPush.notify({ title: notify.title || '' });
      }
      setLatestNotificationId(notification.id);
    }
  }, [newNotificationData, setLatestNotificationId]);

  // User Sig Nonces Subscription
  const { data: userSigNoncesData } = useUserSigNoncesSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { address }
  });

  useEffect(() => {
    if (userSigNoncesData?.userSigNonces) {
      setLensHubOnchainSigNonce(
        userSigNoncesData.userSigNonces.lensHubOnchainSigNonce
      );
    }
  }, [userSigNoncesData, setLensHubOnchainSigNonce]);

  return null;
};

export default LensSubscriptionsProvider;
