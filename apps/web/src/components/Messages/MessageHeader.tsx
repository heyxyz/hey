import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import useSendOptimisticMessage from '@components/utils/hooks/useSendOptimisticMessage';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import { Image } from '@lenster/ui';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

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

  const { sendMessage } = useSendOptimisticMessage(conversationKey ?? '');

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
          <img
            src="/camera-video.svg"
            onClick={async () => {
              const apiCall = await fetch(
                'https://api.huddle01.com/api/v1/create-room',
                {
                  method: 'POST',
                  body: JSON.stringify({
                    title: 'Huddle01 Meeting'
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                  }
                }
              );
              const data = await apiCall.json();
              const { roomId } = data.data;
              const currentUrl = window.location.href;
              const url = currentUrl.match(/^https?:\/\/([^/]+)/)?.[0];
              sendMessage(
                `Join here for a call: ${url}/meet/${roomId}`,
                ContentTypeText,
              );
              window.open(
                `/meet/${roomId}`,
                'newwindow',
                'width=1200, height=800'
              );
            }}
            className="mb-2 mr-4 inline h-8 w-8 cursor-pointer"
          />
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
      )}
    </div>
  );
};

export default MessageHeader;
