import type { Conversation } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversation?: Conversation) => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const loadMessages = async () => {
      const newMessages = await conversation.messages();
      messages.set(conversation.peerAddress, newMessages);
      setMessages(new Map(messages));
    };
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  return {
    messages
  };
};

export default useGetMessages;
