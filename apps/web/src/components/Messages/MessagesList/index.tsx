import type { CachedConversation } from '@xmtp/react-sdk';

import cn from '@hey/ui/cn';
import { useMessages } from '@xmtp/react-sdk';
import { type FC, useEffect, useRef } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Composer from './Composer';
import StartConversation from './Composer/StartConversation';

const MessagesList: FC = () => {
  const { currentProfile } = useProfileStore();
  const { selectedConversation } = useMessagesStore();
  const { messages } = useMessages(selectedConversation as CachedConversation);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedConversation) {
    return <StartConversation />;
  }

  return (
    <div>
      <div className="flex h-[80vh] max-h-[85vh] flex-col-reverse space-y-5 overflow-y-auto p-5">
        <div ref={endOfMessagesRef} />
        {[...messages].reverse().map((message) => {
          const isSender =
            message.senderAddress === currentProfile?.ownedBy.address;

          return (
            <div
              className={cn('flex', { 'justify-end': isSender })}
              key={message.id}
            >
              <div
                className={cn(
                  isSender
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-300 text-black',
                  'max-w-xs rounded-lg px-4 py-2'
                )}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
      <Composer conversation={selectedConversation} />
    </div>
  );
};

export default MessagesList;
