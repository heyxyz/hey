import type { CachedConversation } from '@xmtp/react-sdk';

import { useLastMessage, useStreamMessages } from '@xmtp/react-sdk';
import { type FC, useEffect, useState } from 'react';

interface LatestMessageProps {
  conversation: CachedConversation;
}

const LatestMessage: FC<LatestMessageProps> = ({ conversation }) => {
  const lastMessage = useLastMessage(conversation.topic);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (lastMessage) {
      setMessage(lastMessage.content);
    }
  }, [lastMessage]);

  useStreamMessages(conversation, {
    onMessage: (data) => {
      setMessage(data.content);
    }
  });

  if (!message) {
    return null;
  }

  return (
    <div className="ld-text-gray-500 max-w-60 truncate text-sm">{message}</div>
  );
};

export default LatestMessage;
