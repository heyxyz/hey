import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import formatAddress from 'lib/formatAddress';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import getStampFyiURL from 'lib/getStampFyiURL';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';
import { FollowSource } from 'src/tracking';
import { Image } from 'ui';

import Follow from '../Shared/Follow';

interface MessageHeaderProps {
  profile?: Profile;
  conversationKey?: string;
}

const MessageHeader: FC<MessageHeaderProps> = ({
  profile,
  conversationKey
}) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useMessageStore((state) => state.unsyncProfile);
  const ensNames = useMessageStore((state) => state.ensNames);
  const ensName = ensNames.get(conversationKey?.split('/')[0] ?? '');
  const url =
    (ensName && getStampFyiURL(conversationKey?.split('/')[0] ?? '')) ?? '';

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
      unsyncProfile(profile?.id ?? '');
    },
    [setFollowing, unsyncProfile, profile?.id]
  );

  const onBackClick = () => {
    router.push('/messages');
  };

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe]);

  if (!profile && !conversationKey) {
    return null;
  }

  return (
    <div className="divider flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <ChevronLeftIcon
          onClick={onBackClick}
          className="mr-1 h-6 w-6 cursor-pointer lg:hidden"
        />
        {profile ? (
          <UserProfile profile={profile} />
        ) : (
          <>
            <Image
              src={ensName ? url : getAvatar(profile)}
              loading="lazy"
              className="mr-4 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={formatHandle('')}
            />
            {ensName ?? formatAddress(conversationKey ?? '')}
          </>
        )}
      </div>
      {profile && (
        <div>
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
      )}
    </div>
  );
};

export default MessageHeader;
