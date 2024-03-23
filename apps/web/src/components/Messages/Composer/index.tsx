import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { useSendMessage } from '@xmtp/react-sdk';
import { useCallback, useState } from 'react';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendMessage } = useSendMessage();

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (conversation.peerAddress && message) {
        setIsSending(true);
        await sendMessage(conversation, message);
        setIsSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, conversation.peerAddress, sendMessage]
  );

  return (
    <form onSubmit={handleSendMessage}>
      <input
        disabled={isSending}
        name="messageInput"
        onChange={handleMessageChange}
        type="text"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Composer;
