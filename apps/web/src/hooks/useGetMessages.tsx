import { MESSAGE_PAGE_LIMIT } from '@lenster/data/constants';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversationKey: string, endTime?: Date) => {
  const conversations = useMessageStore((state) => state.conversations);
  const messages = useMessageStore((state) =>
    state.messages.get(conversationKey)
  );
  const addMessages = useMessageStore((state) => state.addMessages);
  const [hasMore, setHasMore] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    const conversation = conversations.get(conversationKey);
    if (!conversation) {
      return;
    }

    const loadMessages = async () => {
      const newMessages = await conversation.messages({
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
        limit: MESSAGE_PAGE_LIMIT,
        endTime: endTime
      });
      if (newMessages.length > 0) {
        addMessages(conversationKey, newMessages);
        if (newMessages.length < MESSAGE_PAGE_LIMIT) {
          hasMore.set(conversationKey, false);
          setHasMore(new Map(hasMore));
        } else {
          hasMore.set(conversationKey, true);
          setHasMore(new Map(hasMore));
        }
      } else {
        hasMore.set(conversationKey, false);
        setHasMore(new Map(hasMore));
      }
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey, endTime]);

  return {
    messages,
    hasMore: hasMore.get(conversationKey) ?? false
  };
};

export default useGetMessages;
