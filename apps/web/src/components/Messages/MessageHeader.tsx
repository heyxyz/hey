import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Follow, { FollowSource } from '../Shared/Follow';

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
    <div className="flex items-center justify-between border-b-[1px] px-4 py-2 dark:border-gray-700">
      <div className="flex items-center">
        <ChevronLeftIcon onClick={onBackClick} className="mr-1 h-6 w-6 cursor-pointer lg:hidden" />
        <UserProfile profile={profile} />
      </div>
      {!following ? (
        <Follow
          showText
          profile={profile}
          setFollowing={setFollowing}
          followSource={FollowSource.DIRECT_MESSAGE_HEADER}
        />
      ) : (
        <Unfollow showText profile={profile} setFollowing={setFollowing} />
      )}
    </div>
  );
};

export default MessageHeader;
