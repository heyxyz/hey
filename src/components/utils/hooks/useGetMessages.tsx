import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversation?: Conversation, endTime?: Date) => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const [hasMore, setHasMore] = useState(true);

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
      if (newMessages.length > 0) {
        const address = conversation.peerAddress.toLowerCase();
        const msgObj = [...newMessages, ...(messages.get(address) ?? [])];
        const uniqueMessages = [...Array.from(new Map(msgObj.map((item) => [item['id'], item])).values())];
        uniqueMessages.sort((a, b) => {
          return (b.sent?.getTime() ?? 0) - (a.sent?.getTime() ?? 0);
        });
        messages.set(address, uniqueMessages);
        setMessages(new Map(messages));
        if (Array.isArray(messages.get(address)) && (messages.get(address)?.length ?? 0) < 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, endTime]);

  return {
    messages,
    hasMore
  };
};

export default useGetMessages;
