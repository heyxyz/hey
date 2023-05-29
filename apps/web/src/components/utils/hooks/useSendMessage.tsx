import { parseConversationKey } from '@lib/conversationKey';
import type { ContentTypeId } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';

const useSendMessage = (conversationKey: string) => {
  const client = useMessageStore((state) => state.client);
  const conversations = useMessageStore((state) => state.conversations);
  const addConversation = useMessageStore((state) => state.addConversation);
  const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>(false);

  const sendMessage = async (
    content: string | RemoteAttachment,
    contentType: ContentTypeId,
    fallback: string | undefined
  ): Promise<boolean> => {
    if (!client || !conversationKey) {
      return false;
    }

    let conversation;

    if (!missingXmtpAuth && !conversations.has(conversationKey)) {
      const conversationId = conversationKey?.split('/')[0];

      const conversationXmtpId =
        parseConversationKey(conversationKey)?.conversationId ?? '';

      conversation =
        conversationXmtpId !== ''
          ? await client.conversations.newConversation(conversationId, {
              conversationId: conversationXmtpId,
              metadata: {}
            })
          : await client.conversations.newConversation(conversationId);

      addConversation(conversationKey, conversation);
    } else {
      conversation = conversations.get(conversationKey);
    }

    if (!conversation) {
      return false;
    }

    try {
      await conversation.send(content, {
        contentType,
        contentFallback: fallback
      });
    } catch (error) {
      console.error('Failed to send message', error);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const checkUserIsOnXmtp = async () => {
      if (client && !conversations.has(conversationKey)) {
        const conversationId = conversationKey?.split('/')[0];
        const canMessage = await client.canMessage(conversationId);
        setMissingXmtpAuth(!canMessage);

        if (!canMessage || !conversationId) {
          return false;
        }
      }
    };
    checkUserIsOnXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey, client]);

  return { sendMessage, missingXmtpAuth };
};

export default useSendMessage;
