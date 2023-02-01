import UserPreview from '@components/Shared/UserPreview';
import { UserAddIcon } from '@heroicons/react/solid';
import formatTime from '@lib/formatTime';
import { defineMessage } from '@lingui/macro';
import { Trans } from '@lingui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewFollowerNotification } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { NotificationWalletProfileAvatar, NotificationWalletProfileName } from '../WalletProfile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewFollowerNotification;
}

const messageFollow = defineMessage({
  id: '<0><1/> followed you</0>'
});

const messageSuperFollow = defineMessage({
  id: '<0><1/> super followed you</0>'
});

const FollowerNotification: FC<Props> = ({ notification }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isSuperFollow = currentProfile?.followModule?.__typename === 'FeeFollowModuleSettings';

  return (
    <div className="flex items-start justify-between">
      <div className="w-4/5 space-y-2">
        <div className="flex items-center space-x-3">
          {isSuperFollow ? (
            <UserAddIcon className="h-6 w-6 text-pink-500/70" />
          ) : (
            <UserAddIcon className="h-6 w-6 text-green-500/70" />
          )}
          {notification?.wallet?.defaultProfile ? (
            <UserPreview profile={notification?.wallet?.defaultProfile}>
              <NotificationProfileAvatar profile={notification?.wallet?.defaultProfile} />
            </UserPreview>
          ) : (
            <NotificationWalletProfileAvatar wallet={notification?.wallet} />
          )}
        </div>
        <div className="ml-9">
          <Trans
            id={(isSuperFollow ? messageSuperFollow.id : messageFollow.id) || ''}
            components={[
              <span className="text-gray-600 dark:text-gray-400" key="" />,
              notification?.wallet?.defaultProfile ? (
                <NotificationProfileName profile={notification?.wallet?.defaultProfile} />
              ) : (
                <NotificationWalletProfileName wallet={notification?.wallet} />
              )
            ]}
          />
        </div>
      </div>
      <div className="text-[12px] text-gray-400" title={formatTime(notification?.createdAt)}>
        {dayjs(new Date(notification?.createdAt)).fromNow()}
      </div>
    </div>
  );
};

export default FollowerNotification;
