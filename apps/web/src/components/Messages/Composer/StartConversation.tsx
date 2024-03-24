import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import {
  ArrowRightCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Button, EmptyState, Input } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useCanMessage, useStartConversation } from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

const StartConversation: FC = () => {
  const {
    newConversationAddress,
    setNewConversationAddress,
    setSelectedConversation
  } = useMessagesStore();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOnXmtp, setIsOnXmtp] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { staffMode } = useFeatureFlagsStore();

  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();

  const getIsOnXmtp = async () => {
    if (newConversationAddress) {
      setIsOnXmtp(await canMessage(newConversationAddress));
    }
  };

  useEffect(() => {
    getIsOnXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newConversationAddress]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newConversationAddress && message) {
      setIsSending(true);
      const conversation = await startConversation(
        newConversationAddress,
        message
      );
      setNewConversationAddress(null);
      setSelectedConversation(
        conversation.cachedConversation as CachedConversation
      );
      setIsSending(false);
    }
  };

  return (
    <div>
      <div
        className={cn(
          staffMode ? 'h-[85vh] max-h-[85vh]' : 'h-[87vh] max-h-[87vh]',
          'flex items-center justify-center p-5'
        )}
      >
        <EmptyState
          hideCard
          icon={
            isOnXmtp ? (
              <ArrowRightCircleIcon className="size-10" />
            ) : (
              <EnvelopeIcon className="size-10" />
            )
          }
          message={isOnXmtp ? 'Begin your conversation' : 'User is not on XMTP'}
        />
      </div>
      <form
        className="flex items-center space-x-2 border-t p-5"
        onSubmit={handleStartConversation}
      >
        <Input
          autoFocus
          disabled={isSending || !isOnXmtp}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          ref={inputRef}
          type="text"
          value={message}
        />
        <Button disabled={!isOnXmtp || isSending || !message} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};

export default StartConversation;
