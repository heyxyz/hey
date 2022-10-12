import getAvatar from '@lib/getAvatar';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Follow from './Follow';

const MessageHeader: FC = () => {
  const [following, setFollowing] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="flex justify-between flex-1 p-4 border-b-[1px]">
      <div className="flex items-center">
        <img
          src={getAvatar(currentProfile)}
          className="h-10 w-10 bg-gray-200 rounded-full border dark:border-gray-700/80 mr-2"
          alt={currentProfile?.handle}
        />
        <div>{currentProfile?.handle}</div>
      </div>
      <div>
        {currentProfile && !following && (
          <Follow showText profile={currentProfile} setFollowing={setFollowing} />
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
