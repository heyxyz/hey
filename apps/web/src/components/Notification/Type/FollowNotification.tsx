import { UserPlusIcon } from '@heroicons/react/24/outline';
import { FollowNotification } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import plur from 'plur';
import type { FC } from 'react';
import { memo } from 'react';
import { useAppStore } from 'src/store/app';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';

interface FollowNotificationProps {
  notification: FollowNotification;
}

const FollowNotification: FC<FollowNotificationProps> = ({ notification }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const followers = notification?.followers;
  const firstProfile = followers?.[0];
  const length = followers.length - 1;
  const moreThanOneProfile = length > 1;

  const text = moreThanOneProfile
    ? `and ${length} ${plur('other', length)} followed`
    : 'followed';
  const type = 'you';

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <UserPlusIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          {followers.map((follower) => (
            <div key={follower.id}>
              <NotificationProfileAvatar profile={follower} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={
            currentProfile?.handle
              ? `/u/${formatHandle(currentProfile?.handle)}`
              : `/profile/${currentProfile?.id}`
          }
        />
      </div>
    </div>
  );
};

export default memo(FollowNotification);
