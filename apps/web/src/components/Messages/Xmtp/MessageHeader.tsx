import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useXmtpMessageStore } from 'src/store/xmtp-message';
import { FollowSource } from 'src/tracking';

interface MessageHeaderProps {
  profile?: Profile;
}

const MessageHeader: FC<MessageHeaderProps> = ({ profile }) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useXmtpMessageStore((state) => state.unsyncProfile);

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
      unsyncProfile(profile?.id ?? '');
    },
    [setFollowing, unsyncProfile, profile?.id]
  );

  const onBackClick = () => {
    router.push('/messages/xmtp');
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
