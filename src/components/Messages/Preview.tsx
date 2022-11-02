import type { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { useAppStore } from 'src/store/app';

dayjs.extend(relativeTime);

interface Props {
  profile: Profile;
  message: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

const Preview: FC<Props> = ({ profile, message, conversationKey, isSelected }) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy;

  const onConversationSelected = (profileId: string) => {
    router.push(profileId ? `/messages/${conversationKey}` : '/messages');
  };

  return (
    <div
      className={clsx(
        { 'bg-gray-50': isSelected },
        'flex justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
      onClick={() => onConversationSelected(profile.id)}
    >
      <div className="flex items-center space-x-3">
        <img
          src={getAvatar(profile)}
          className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700/80"
          height={40}
          width={40}
          alt={profile?.handle}
        />
        <div>
          <div className="flex items-center">
            <div className="line-clamp-1 text-md">{profile?.name ?? profile.handle}</div>
            {isVerified(profile?.id) && <BadgeCheckIcon className="min-w-fit w-4 h-4 text-brand" />}
          </div>
          <span className="text-sm text-gray-500 line-clamp-1 break-words">
            {address === message.senderAddress && 'You: '} {message.content.substring(0, 16)}
          </span>
        </div>
      </div>
      {message.sent && (
        <span className="ml-4 text-xs text-gray-500">{dayjs(new Date(message.sent)).fromNow()}</span>
      )}
    </div>
  );
};

export default Preview;
