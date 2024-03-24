import type { CachedConversation } from '@xmtp/react-sdk';
import type { Address } from 'viem';

import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';
import cn from '@hey/ui/cn';
import { useMessages } from '@xmtp/react-sdk';
import { type FC, useEffect, useRef } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Composer from '../Composer';

const MessagesList: FC = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();
  const { selectedConversation } = useMessagesStore();
  const { messages } = useMessages(selectedConversation as CachedConversation);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedConversation) {
    return null;
  }

  return (
    <div>
      <div className="px-5 py-2.5">
        <LazyDefaultProfile
          address={selectedConversation.peerAddress as Address}
        />
      </div>
      <div className="divider" />
      <div
        className={cn(
          staffMode ? 'h-[79vh] max-h-[79vh]' : 'h-[81.5vh] max-h-[81.5vh]',
          'flex flex-col-reverse space-y-5 overflow-y-auto p-5'
        )}
      >
        <div ref={endOfMessagesRef} />
        {[...messages]
          .reverse()
          .filter((message) => message.content?.length > 0)
          .map((message) => {
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
                    'max-w-xs break-words rounded-lg px-4 py-2'
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
