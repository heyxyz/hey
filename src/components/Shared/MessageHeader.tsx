import type { Profile } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import Follow from './Follow';

interface Props {
  profile?: Profile;
}

const MessageHeader: FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState(true);

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe]);

  console.log(following);

  return (
    <div className="flex justify-between flex-1 p-4 border-b-[1px]">
      <div className="flex items-center">
        <img
          src={getAvatar(profile)}
          loading="lazy"
          className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700/80 mr-2"
          height={40}
          width={40}
          alt={profile?.handle}
        />
        <div>{profile?.handle}</div>
      </div>
      <div>
        {profile && !following ? <Follow showText profile={profile} setFollowing={setFollowing} /> : null}
      </div>
    </div>
  );
};

export default MessageHeader;
