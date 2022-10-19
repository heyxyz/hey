import getUniqueMessages from '@lib/getUniqueMessages';
import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { MESSAGE_PAGE_LIMIT } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversation?: Conversation, endTime?: Date) => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const [hasMore, setHasMore] = useState<Map<string, boolean>>(new Map());
  const conversationAddress = conversation?.peerAddress.toLowerCase() ?? '';
  const currentProfile = useAppStore((state) => state.currentProfile);

  const reset = () => {
    setMessages(new Map());
    setHasMore(new Map());
  };

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const loadMessages = async () => {
      hasMore.set(conversationAddress, true);
      setHasMore(new Map(hasMore));
      const newMessages = await conversation.messages({
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
        limit: MESSAGE_PAGE_LIMIT,
        endTime: endTime
      });
      if (newMessages.length > 0) {
        const oldMessages = messages.get(conversationAddress) ?? [];
        const msgObj = [...oldMessages, ...newMessages];
        const uniqueMessages = getUniqueMessages(msgObj);
        messages.set(conversationAddress, uniqueMessages);
        setMessages(new Map(messages));
        if (newMessages.length < MESSAGE_PAGE_LIMIT) {
          hasMore.set(conversationAddress, false);
          setHasMore(new Map(hasMore));
        }
      } else {
        hasMore.set(conversationAddress, false);
        setHasMore(new Map(hasMore));
      }
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, endTime]);

  useEffect(() => {
    if (!currentProfile) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    messages,
    hasMore: hasMore.get(conversationAddress) ?? false
  };
};

export default useGetMessages;
