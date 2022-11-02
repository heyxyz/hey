import type { NewFollowerNotification } from '@generated/types';
import { UserAddIcon } from '@heroicons/react/solid';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { NotificationWalletProfileAvatar, NotificationWalletProfileName } from '../WalletProfile';
import Actions from './Actions';

interface Props {
  notification: NewFollowerNotification;
}

const FollowerNotification: FC<Props> = ({ notification }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [following, setFollowing] = useState(notification?.wallet?.defaultProfile?.isFollowedByMe);
  const isSuperFollow = currentProfile?.followModule?.__typename === 'FeeFollowModuleSettings';

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          {isSuperFollow ? (
            <UserAddIcon className="h-6 w-6 text-pink-500/70" />
          ) : (
            <UserAddIcon className="h-6 w-6 text-green-500/70" />
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
            {isSuperFollow ? 'super' : ''} followed you
          </span>
        </div>
      </div>
      {notification?.wallet?.defaultProfile && (
        <Actions profile={notification?.wallet?.defaultProfile} notification={notification} />
      )}
    </div>
  );
};

export default FollowerNotification;
