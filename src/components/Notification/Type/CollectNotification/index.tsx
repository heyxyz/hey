import { NotificationProfileAvatar, NotificationProfileName } from '@components/Notification/Profile';
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '@components/Notification/WalletProfile';
import { LensterNotification } from '@generated/lenstertypes';
import { NewCollectNotification } from '@generated/types';
import { CashIcon, CollectionIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React, { FC } from 'react';

import CollectedAmount from './Amount';
import CollectedContent from './Content';

dayjs.extend(relativeTime);

interface Props {
  notification: NewCollectNotification & LensterNotification;
}

const CollectNotification: FC<Props> = ({ notification }) => {
  const publicationType =
    notification?.collectedPublication?.metadata?.attributes[0]?.value ??
    notification?.collectedPublication?.__typename?.toLowerCase();

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          {publicationType === 'crowdfund' ? (
            <CashIcon className="h-6 w-6 text-pink-500/70" />
          ) : (
            <CollectionIcon className="h-6 w-6 text-pink-500/70" />
          )}
          {notification?.wallet?.defaultProfile ? (
            <NotificationProfileAvatar profile={notification?.wallet?.defaultProfile} />
          ) : (
            <NotificationWalletProfileAvatar wallet={notification?.wallet} />
          )}
        </div>
        <div className="ml-9">
          {notification?.wallet?.defaultProfile ? (
            <NotificationProfileName profile={notification?.wallet?.defaultProfile} />
          ) : (
            <NotificationWalletProfileName wallet={notification?.wallet} />
          )}{' '}
          <span className="text-gray-600 dark:text-gray-400">
            {publicationType === 'crowdfund' ? 'funded your' : 'collected your'}{' '}
          </span>
          <Link href={`/posts/${notification?.collectedPublication?.id}`}>
            <a href={`/posts/${notification?.collectedPublication?.id}`} className="font-bold">
              {publicationType}
            </a>
          </Link>
          <CollectedContent notification={notification} />
          <CollectedAmount notification={notification} />
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default CollectNotification;
