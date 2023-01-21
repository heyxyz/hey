import { NotificationProfileAvatar, NotificationProfileName } from '@components/Notification/Profile';
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '@components/Notification/WalletProfile';
import UserPreview from '@components/Shared/UserPreview';
import type { MessageDescriptor } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/solid';
import formatTime from '@lib/formatTime';
import { defineMessage } from '@lingui/macro';
import { Trans } from '@lingui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewCollectNotification } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

import CollectedAmount from './Amount';
import CollectedContent from './Content';

dayjs.extend(relativeTime);

interface Props {
  notification: NewCollectNotification;
}

const messages: Record<string, MessageDescriptor> = {
  comment: defineMessage({
    id: '<0><1/> collected your <2>comment</2></0>'
  }),
  mirror: defineMessage({
    id: '<0><1/> collected your <2>mirror</2></0>'
  }),
  post: defineMessage({
    id: '<0><1/> collected your <2>post</2></0>'
  })
};

const defaultMessage = (typeName: string): string => {
  return '<0><1/> collected your <2>' + typeName + '</2></0>';
};

const CollectNotification: FC<Props> = ({ notification }) => {
  const typeName = notification?.collectedPublication.__typename?.toLowerCase() || '';
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          <CollectionIcon className="h-6 w-6 text-pink-500/70" />
          {notification?.wallet?.defaultProfile ? (
            <UserPreview isBig={false} profile={notification?.wallet?.defaultProfile}>
              <NotificationProfileAvatar profile={notification?.wallet?.defaultProfile} />
            </UserPreview>
          ) : (
            <NotificationWalletProfileAvatar wallet={notification?.wallet} />
          )}
        </div>
        <div className="ml-9">
          <Trans
            id={messages[typeName]?.id || defaultMessage(typeName)}
            components={[
              <span className="text-gray-600 dark:text-gray-400" key="" />,
              notification?.wallet?.defaultProfile ? (
                <NotificationProfileName profile={notification?.wallet?.defaultProfile} />
              ) : (
                <NotificationWalletProfileName wallet={notification?.wallet} />
              ),
              <Link href={`/posts/${notification?.collectedPublication?.id}`} className="font-bold" key="" />
            ]}
          />
          <CollectedContent notification={notification} />
          <CollectedAmount notification={notification} />
        </div>
      </div>
      <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
        {dayjs(new Date(notification?.createdAt)).fromNow()}
      </div>
    </div>
  );
};

export default CollectNotification;
