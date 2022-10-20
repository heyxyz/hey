import type { Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: string): Promise<boolean> => {
      if (!conversation) {
        return false;
      }
      const sent = await conversation.send(message);
      return sent != null;
    },
    [conversation]
  );

  return {
    sendMessage
  };
};

export default useSendMessage;
