import type { Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: string): Promise<boolean> => {
      if (!conversation) {
        return false;
      }
      try {
        await conversation.send(message);
      } catch (error) {
        return false;
      }
      return true;
    },
    [conversation]
  );

  return {
    sendMessage
  };
};

export default useSendMessage;
