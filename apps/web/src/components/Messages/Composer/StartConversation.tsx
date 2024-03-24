import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { Button, EmptyState, Input } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useStartConversation } from '@xmtp/react-sdk';
import { useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { staffMode } = useFeatureFlagsStore();

  const { startConversation } = useStartConversation();

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
          icon={<ArrowRightCircleIcon className="size-10" />}
          message="Begin your conversation"
        />
      </div>
      <form
        className="flex items-center space-x-2 border-t p-5"
        onSubmit={handleStartConversation}
      >
        <Input
          autoFocus
          disabled={isSending}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          ref={inputRef}
          type="text"
          value={message}
        />
        <Button disabled={isSending || !message} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};

export default StartConversation;
