import { NewFollowerNotification } from '@generated/types';
import { UserAddIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC } from 'react';
import { useAppStore } from 'src/store/app';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { NotificationWalletProfileAvatar, NotificationWalletProfileName } from '../WalletProfile';

dayjs.extend(relativeTime);

interface Props {
  notification: NewFollowerNotification;
}

const FollowerNotification: FC<Props> = ({ notification }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
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
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default FollowerNotification;
