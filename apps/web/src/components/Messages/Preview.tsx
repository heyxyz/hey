import { BadgeCheckIcon } from '@heroicons/react/solid';
import { formatTime, getTimeFromNow } from '@lib/formatTime';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import isVerified from 'lib/isVerified';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { Image } from 'ui';

interface PreviewProps {
  profile: Profile;
  message?: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

const Preview: FC<PreviewProps> = ({
  profile,
  message,
  conversationKey,
  isSelected
}) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy;

  const onConversationSelected = (profileId: string) => {
    router.push(profileId ? `/messages/${conversationKey}` : '/messages');
  };

  return (
    <div
      className={clsx(
        'cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-50 dark:bg-gray-800'
      )}
      onClick={() => onConversationSelected(profile.id)}
      aria-hidden="true"
    >
      <div className="flex space-x-3 overflow-hidden px-5">
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(profile, false);
          }}
          src={getAvatar(profile)}
          loading="lazy"
          className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
          height={40}
          width={40}
          alt={formatHandle(profile?.handle)}
        />
        <div className="grow overflow-hidden">
          <div className="flex justify-between space-x-1">
            <div className="flex items-center gap-1 overflow-hidden">
              <div className="text-md truncate">
                {profile?.name ?? formatHandle(profile.handle)}
              </div>
              {isVerified(profile?.id) && (
                <BadgeCheckIcon className="text-brand h-4 w-4 min-w-fit" />
              )}
            </div>
            {message?.sent && (
              <span
                className="lt-text-gray-500 shrink-0 pt-0.5 text-xs"
                title={formatTime(message.sent)}
              >
                {getTimeFromNow(message.sent)}
              </span>
            )}
          </div>
          <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
            {address === message?.senderAddress && 'You: '} {message?.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
