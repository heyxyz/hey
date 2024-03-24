import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { Button, Input } from '@hey/ui';
import { useSendMessage } from '@xmtp/react-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendMessage } = useSendMessage({
    onSuccess: () => {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation.peerAddress && message) {
      setIsSending(true);
      await sendMessage(conversation, message);
      setIsSending(false);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  return (
    <form
      className="flex items-center space-x-2 border-t p-5"
      onSubmit={handleSendMessage}
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
      <Button disabled={isSending} type="submit">
        Send
      </Button>
    </form>
  );
};

export default Composer;
