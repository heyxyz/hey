import type { ContentTypeId, Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (content: any, contentType: ContentTypeId): Promise<boolean> => {
      if (!conversation) {
        return false;
      }
      try {
        await conversation.send(content, {
          contentType: contentType
        });
      } catch (error) {
        return false;
      }
      return true;
    },
    [conversation]
  );

  return { sendMessage };
};

export default useSendMessage;
