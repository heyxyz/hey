import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import hasMisused from '@hey/lib/hasMisused';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import { formatTime, getTimeFromNow } from '@lib/formatTime';
import isVerified from '@lib/isVerified';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

interface PreviewProps {
  ensName?: string;
  profile?: Profile;
  message?: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

interface MessagePreviewProps {
  message: DecodedMessage;
}

const MessagePreview: FC<MessagePreviewProps> = ({ message }) => {
  if (message.contentType.sameAs(ContentTypeText)) {
    return <span>{message.content}</span>;
  } else if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    const remoteAttachment: RemoteAttachment = message.content;
    return <span>{remoteAttachment.filename}</span>;
  } else {
    return <span>''</span>;
  }
};

const Preview: FC<PreviewProps> = ({
  ensName,
  profile,
  message,
  conversationKey,
  isSelected
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  );
  const address = currentProfile?.ownedBy;

  const onConversationSelected = () => {
    setConversationKey(conversationKey);
  };

  const url = (ensName && getStampFyiURL(conversationKey?.split('/')[0])) ?? '';

  return (
    message?.content && (
      <div
        className={cn(
          'cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800',
          isSelected && 'bg-gray-50 dark:bg-gray-800'
        )}
        onClick={() => onConversationSelected()}
        aria-hidden="true"
      >
        <div className="flex space-x-3 overflow-hidden px-5">
          <Image
            src={
              profile?.handle
                ? getAvatar(profile)
                : ensName
                ? url
                : getAvatar('')
            }
            loading="lazy"
            className="h-10 min-h-[40px] w-10 min-w-[40px] rounded-full border bg-gray-200 dark:border-gray-700"
            height={40}
            width={40}
            alt={formatHandle(profile?.handle)}
          />
          <div className="grow overflow-hidden">
            <div className="flex justify-between space-x-1">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="text-md truncate">
                  {profile?.handle
                    ? sanitizeDisplayName(profile?.name) ||
                      formatHandle(profile.handle)
                    : ensName || formatAddress(conversationKey?.split('/')[0])}
                </div>
                {isVerified(profile?.id) ? (
                  <CheckBadgeIcon className="text-brand h-4 w-4 min-w-fit" />
                ) : null}
                {hasMisused(profile?.id) ? (
                  <ExclamationCircleIcon className="h-4 w-4 min-w-fit text-red-500" />
                ) : null}
              </div>
              {message?.sent ? (
                <span
                  className="lt-text-gray-500 shrink-0 pt-0.5 text-xs"
                  title={formatTime(message.sent)}
                >
                  {getTimeFromNow(message.sent)}
                </span>
              ) : null}
            </div>
            <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
              {address === message?.senderAddress ? 'You: ' : null}
              <MessagePreview message={message} />
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default Preview;
