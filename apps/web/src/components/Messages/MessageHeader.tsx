import Unfollow from '@components/Shared/Profile/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getAvatar from '@hey/lib/getAvatar';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import { Image } from '@hey/ui';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

import Follow from '../Shared/Profile/Follow';

interface MessageHeaderProps {
  profile?: Profile;
  conversationKey?: string;
}

const MessageHeader: FC<MessageHeaderProps> = ({
  profile,
  conversationKey
}) => {
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useMessageStore((state) => state.unsyncProfile);
  const ensNames = useMessageStore((state) => state.ensNames);
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  );
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
    setConversationKey('');
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
          <div className="flex min-h-[48px] items-center space-x-3">
            <Image
              src={ensName ? url : getAvatar(profile)}
              loading="lazy"
              className="h-10 min-h-[40px] w-10 min-w-[40px] rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={ensName ?? formatAddress(conversationKey ?? '')}
            />
            <div>{ensName ?? formatAddress(conversationKey ?? '')}</div>
          </div>
        )}
      </div>
      {profile ? (
        <div>
          {!following ? (
            <Follow
              showText
              profile={profile}
              setFollowing={setFollowingWrapped}
              followUnfollowSource={FollowUnfollowSource.DIRECT_MESSAGE_HEADER}
            />
          ) : (
            <Unfollow
              showText
              profile={profile}
              setFollowing={setFollowingWrapped}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MessageHeader;
