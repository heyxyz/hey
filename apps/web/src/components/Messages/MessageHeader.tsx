import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Follow from '../Shared/Follow';

interface Props {
  profile?: Profile;
}

const MessageHeader: FC<Props> = ({ profile }) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);

  const onBackClick = () => {
    router.push('/messages');
  };

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe, profile]);

  if (!profile) {
    return null;
  }

  return (
    <div className="dark:border-gray-700 flex items-center justify-between px-4 py-2 border-b-[1px]">
      <div className="flex items-center">
        <ChevronLeftIcon onClick={onBackClick} className="w-6 h-6 mr-1 lg:hidden cursor-pointer" />
        <UserProfile profile={profile} />
      </div>
      {!following ? (
        <Follow showText profile={profile} setFollowing={setFollowing} />
      ) : (
        <Unfollow showText profile={profile} setFollowing={setFollowing} />
      )}
    </div>
  );
};

export default MessageHeader;
