import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversation?: Conversation, endTime?: Date) => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const loadMessages = async () => {
      const newMessages = await conversation.messages({
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
        limit: 20,
        endTime
      });
      const msgObj = [...newMessages, ...(messages.get(conversation.peerAddress) ?? [])];
      const uniqueMessages = [...Array.from(new Map(msgObj.map((item) => [item['id'], item])).values())];
      uniqueMessages.sort((a, b) => {
        return (b.sent?.getTime() ?? 0) - (a.sent?.getTime() ?? 0);
      });
      messages.set(conversation.peerAddress, uniqueMessages);
      setMessages(new Map(messages));
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, endTime]);

  return {
    messages
  };
};

export default useGetMessages;
