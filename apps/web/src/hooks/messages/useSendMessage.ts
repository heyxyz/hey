import type {
  Conversation,
  Message
} from 'src/store/persisted/useMessageStore';

import { HEY_API_URL } from '@hey/data/constants';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';

export const useSendMessage = () => {
  const {
    conversations,
    messages,
    selectedConversation,
    setConversations,
    setMessages,
    setSelectedConversation
  } = useMessageStore();
  const [sending, setSending] = useState(false);

  const createConversation = async (): Promise<Conversation> => {
    const response = await axios.post(
      `${HEY_API_URL}/message/conversation`,
      { recipient: selectedConversation?.profile },
      { headers: getAuthWorkerHeaders() }
    );
    const { data } = response;

    return data.conversation;
  };

  const sendMessage = useCallback(
    async (content: string) => {
      setSending(true);

      let conversation;
      if (!selectedConversation?.id) {
        conversation = await createConversation();
        setSelectedConversation({
          id: conversation.id,
          profile: conversation.profile
        });
      }

      const newMessage: {
        data: { message: Message };
      } = await axios.post(
        `${HEY_API_URL}/message/send`,
        {
          content,
          conversationId: selectedConversation?.id || conversation?.id
        },
        { headers: getAuthWorkerHeaders() }
      );

      setSending(false);

      setMessages(
        messages
          ? [...messages, newMessage.data.message]
          : [newMessage.data.message]
      );

      // Update conversations to show the latest message
      if (selectedConversation?.id) {
        setConversations(
          conversations?.length
            ? conversations.map((conversation) => {
                if (conversation.id === selectedConversation?.id) {
                  return {
                    ...conversation,
                    latestMessages: newMessage.data.message.content
                  };
                }
                return conversation;
              })
            : []
        );
      } else {
        if (conversation) {
          setConversations([
            {
              ...conversation,
              latestMessages: newMessage.data.message.content
            },
            ...(conversations as Conversation[])
          ]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedConversation, conversations]
  );

  return { sending, sendMessage };
};
