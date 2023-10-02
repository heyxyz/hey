import {
  NotificationProfileAvatar,
  NotificationProfileName
} from '@components/Notification/Profile';
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '@components/Notification/WalletProfile';
import UserPreview from '@components/Shared/UserPreview';
import { RectangleStackIcon } from '@heroicons/react/24/solid';
import type { NewCollectNotification } from '@hey/lens';
import type { MessageDescriptor } from '@hey/types/misc';
import { formatTime, getTimeFromNow } from '@lib/formatTime';
import { defineMessage } from '@lingui/macro';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import CollectedAmount from './Amount';
import CollectedContent from './Content';

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

interface CollectNotificationProps {
  notification: NewCollectNotification;
}

const CollectNotification: FC<CollectNotificationProps> = ({
  notification
}) => {
  const typeName =
    notification?.collectedPublication.__typename?.toLowerCase() || '';
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RectangleStackIcon className="h-6 w-6 text-pink-500/70" />
            {notification?.wallet?.defaultProfile ? (
              <UserPreview
                isBig={false}
                profile={notification?.wallet?.defaultProfile}
              >
                <NotificationProfileAvatar
                  profile={notification?.wallet?.defaultProfile}
                />
              </UserPreview>
            ) : (
              <NotificationWalletProfileAvatar wallet={notification?.wallet} />
            )}
          </div>
          <div
            className="min-w-fit text-[12px] text-gray-400"
            title={formatTime(notification?.createdAt)}
          >
            {getTimeFromNow(notification?.createdAt)}
          </div>
        </div>
        <div className="ml-9">
          <Trans
            id={messages[typeName]?.id || defaultMessage(typeName)}
            components={[
              <span className="text-gray-600 dark:text-gray-400" key="" />,
              notification?.wallet?.defaultProfile ? (
                <NotificationProfileName
                  profile={notification?.wallet?.defaultProfile}
                />
              ) : (
                <NotificationWalletProfileName wallet={notification?.wallet} />
              ),
              <Link
                href={`/posts/${notification?.collectedPublication?.id}`}
                className="font-bold"
                key=""
              />
            ]}
          />
          <CollectedContent notification={notification} />
          <CollectedAmount notification={notification} />
        </div>
      </div>
    </div>
  );
};

export default memo(CollectNotification);
