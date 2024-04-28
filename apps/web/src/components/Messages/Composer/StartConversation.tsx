import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';
import type { Address } from 'viem';

import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';
import { Leafwatch } from '@helpers/leafwatch';
import {
  ArrowRightCircleIcon,
  EnvelopeIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { MESSAGES } from '@hey/data/tracking';
import { Button, EmptyState, Input } from '@hey/ui';
import cn from '@hey/ui/cn';
import {
  useCanMessage,
  useConsent,
  useStartConversation
} from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useAccount } from 'wagmi';

const StartConversation: FC = () => {
  const { address } = useAccount();
  const {
    newConversationAddress,
    setNewConversationAddress,
    setSelectedConversation
  } = useMessagesStore();
  const { staffMode } = useFeatureFlagsStore();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isNotOnXmtp, setIsNotOnXmtp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSameUser = address === newConversationAddress;

  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();
  const { allow } = useConsent();

  const getIsOnXmtp = async () => {
    if (newConversationAddress) {
      setIsNotOnXmtp(!(await canMessage(newConversationAddress)));
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
      await allow([newConversationAddress]);
      const conversation = await startConversation(
        newConversationAddress,
        message
      );
      setNewConversationAddress(null);
      setSelectedConversation(
        conversation.cachedConversation as CachedConversation
      );
      setIsSending(false);
      Leafwatch.track(MESSAGES.START_CONVERSATION);
    }
  };

  return (
    <div>
      <div className="px-5 py-2.5">
        <LazyDefaultProfile address={newConversationAddress as Address} />
      </div>
      <div className="divider" />
      <div
        className={cn(
          staffMode ? 'h-[79vh] max-h-[79vh]' : 'h-[81.5vh] max-h-[81.5vh]',
          'flex items-center justify-center p-5'
        )}
      >
        <EmptyState
          hideCard
          icon={
            isSameUser ? (
              <NoSymbolIcon className="size-10" />
            ) : isNotOnXmtp ? (
              <EnvelopeIcon className="size-10" />
            ) : (
              <ArrowRightCircleIcon className="size-10" />
            )
          }
          message={
            isSameUser
              ? 'You cannot message yourself'
              : isNotOnXmtp
                ? 'User is not on XMTP'
                : 'Begin your conversation'
          }
        />
      </div>
      <form
        className="flex items-center space-x-2 border-t p-5 dark:border-gray-700"
        onSubmit={handleStartConversation}
      >
        <Input
          autoFocus
          disabled={isSameUser || isNotOnXmtp || isSending}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          ref={inputRef}
          type="text"
          value={message}
        />
        <Button
          disabled={isSameUser || isNotOnXmtp || isSending || !message}
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default StartConversation;
