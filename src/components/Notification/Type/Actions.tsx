import Follow from '@components/Shared/Follow';
import type { Profile } from '@generated/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import React, { useState } from 'react';

dayjs.extend(relativeTime);

type Props = {
  profile: Profile;
  notification: any;
};

const Actions: FC<Props> = ({ profile, notification }) => {
  const [following, setFollowing] = useState(profile.isFollowedByMe);

  return (
    <div className="flex flex-col items-end space-y-3.5">
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
      <div>{!following && profile && <Follow profile={profile} setFollowing={setFollowing} />}</div>
    </div>
  );
};

export default Actions;
