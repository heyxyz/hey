import type { Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: string) => {
      if (!conversation) {
        return;
      }
      await conversation.send(message);
    },
    [conversation]
  );

  return {
    sendMessage
  };
};

export default useSendMessage;
