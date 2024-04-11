import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { MESSAGES } from '@hey/data/tracking';
import { Button, Input } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useSendMessage } from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useSendMessage();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation.peerAddress && message) {
      setMessage('');
      inputRef.current?.focus();
      await sendMessage(conversation, message);
      Leafwatch.track(MESSAGES.SEND_MESSAGE);
    }
  };

  return (
    <form
      className="flex items-center space-x-2 border-t p-5 dark:border-gray-700"
      onSubmit={handleSendMessage}
    >
      <Input
        autoFocus
        onChange={handleMessageChange}
        placeholder="Type a message..."
        ref={inputRef}
        type="text"
        value={message}
      />
      <Button disabled={!message} type="submit">
        Send
      </Button>
    </form>
  );
};

export default Composer;
