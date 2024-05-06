import type { CachedMessageWithId } from '@xmtp/react-sdk';
import type { FC } from 'react';

import getTimeFromNow from '@hey/helpers/datetime/getTimeFromNow';
import cn from '@hey/ui/cn';
import { ContentTypeText, hasReaction, useReactions } from '@xmtp/react-sdk';
import { useAccount } from 'wagmi';

interface MessagesProps {
  message: CachedMessageWithId;
}

const Messages: FC<MessagesProps> = ({ message }) => {
  const { address } = useAccount();
  const reactions = useReactions(message);
  const messageHasReaction = hasReaction(message);
  const isSender = message.senderAddress === address;

  if (message.contentType === ContentTypeText.toString()) {
    return (
      <div
        className={cn('flex flex-col', { 'items-end': isSender })}
        key={message.id}
      >
        <div className={cn('flex', { 'justify-end': isSender })}>
          <div
            className={cn(
              isSender
                ? 'bg-gray-700 text-white dark:bg-gray-100 dark:text-black'
                : 'bg-gray-100 dark:bg-gray-700',
              'max-w-xs break-words rounded-3xl px-4 py-2',
              isSender ? 'rounded-br-lg' : 'rounded-bl-lg'
            )}
          >
            {message.content}
          </div>
        </div>
        <div className="ld-text-gray-500 mt-1 text-xs">
          {getTimeFromNow(message.sentAt)}
        </div>
        {messageHasReaction && (
          <div className="mb-1 mt-1 flex w-fit space-x-2 rounded-full">
            {reactions.map((reaction, index) => (
              <div key={index}>
                <span>{reaction.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Messages;
