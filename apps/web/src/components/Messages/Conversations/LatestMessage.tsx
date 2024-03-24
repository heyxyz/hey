import type { CachedConversation } from '@xmtp/react-sdk';

import { useLastMessage } from '@xmtp/react-sdk';
import { type FC } from 'react';

interface LatestMessageProps {
  conversation: CachedConversation;
}

const LatestMessage: FC<LatestMessageProps> = ({ conversation }) => {
  const lastMessage = useLastMessage(conversation.topic);

  if (!lastMessage?.content) {
    return null;
  }

  return (
    <div className="ld-text-gray-500 max-w-60 truncate text-sm">
      {lastMessage?.content}
    </div>
  );
};

export default LatestMessage;
