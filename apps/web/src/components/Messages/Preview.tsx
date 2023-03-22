import { Image } from '@components/UI/Image';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { formatTime, getTimeFromNow } from '@lib/formatTime';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import formatHandle from 'utils/formatHandle';
import getAvatar from 'utils/getAvatar';
import isVerified from 'utils/isVerified';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

interface PreviewProps {
  profile: Profile;
  message: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

function contentFor(message: DecodedMessage): JSX.Element | string {
  if (message.contentType.sameAs(ContentTypeText)) {
    return message.content;
  } else if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    const remoteAttachment: RemoteAttachment = message.content;
    return <span>{remoteAttachment.filename}</span>;
  } else {
    return '';
  }
}

const Preview: FC<PreviewProps> = ({ profile, message, conversationKey, isSelected }) => {
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
    >
      <div className="flex justify-between space-x-3 px-5">
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
        <div className="w-full">
          <div className="flex w-full justify-between space-x-1">
            <div className="flex max-w-sm items-center gap-1">
              <div className="line-clamp-1 text-md">{profile?.name ?? formatHandle(profile.handle)}</div>
              {isVerified(profile?.id) && <BadgeCheckIcon className="text-brand h-4 w-4 min-w-fit" />}
            </div>
            {message.sent && (
              <span className="lt-text-gray-500 min-w-fit pt-0.5 text-xs" title={formatTime(message.sent)}>
                {getTimeFromNow(message.sent)}
              </span>
            )}
          </div>
          <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
            {address === message.senderAddress && 'You: '} {contentFor(message)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preview;
