import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import type { Profile } from 'lens';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';
import { FollowSource } from 'src/tracking';

import Follow from '../Shared/Follow';

interface MessageHeaderProps {
  profile?: Profile;
}

const MessageHeader: FC<MessageHeaderProps> = ({ profile }) => {
  const { push } = useRouter();
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useMessageStore((state) => state.unsyncProfile);

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
      unsyncProfile(profile?.id ?? '');
    },
    [setFollowing, unsyncProfile, profile?.id]
  );

  const onBackClick = () => {
    push('/messages');
  };

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe]);

  if (!profile) {
    return null;
  }

  return (
    <div className="divider flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <ChevronLeftIcon
          onClick={onBackClick}
          className="mr-1 h-6 w-6 cursor-pointer lg:hidden"
        />
        <UserProfile profile={profile} />
      </div>
      {!following ? (
        <Follow
          showText
          profile={profile}
          setFollowing={setFollowingWrapped}
          followSource={FollowSource.DIRECT_MESSAGE_HEADER}
        />
      ) : (
        <Unfollow
          showText
          profile={profile}
          setFollowing={setFollowingWrapped}
        />
      )}
    </div>
  );
};

export default MessageHeader;
