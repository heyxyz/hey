import type { ContentTypeId, Conversation } from '@xmtp/xmtp-js';
import { useCallback } from 'react';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';

const useSendMessage = (conversation?: Conversation) => {
  const sendMessage = useCallback(
    async (
      content: string | RemoteAttachment,
      contentType: ContentTypeId,
      fallback: string | undefined
    ): Promise<boolean> => {
      if (!conversation) {
        return false;
      }
      try {
        await conversation.send(content, {
          contentType,
          contentFallback: fallback
        });
      } catch {
        return false;
      }
      return true;
    },
    [conversation]
  );

  return { sendMessage };
};

export default useSendMessage;
