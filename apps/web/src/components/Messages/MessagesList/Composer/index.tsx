import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { Button, Input } from '@hey/ui';
import { useSendMessage } from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useSendMessage();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation, isSending]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

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
      <Button disabled={isSending || !message} type="submit">
        Send
      </Button>
    </form>
  );
};

export default Composer;
