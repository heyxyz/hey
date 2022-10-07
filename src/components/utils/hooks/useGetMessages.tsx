import { Conversation } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useMessageStore } from 'src/store/message';

const useGetMessages = (conversation?: Conversation) => {
  const messageState = useMessageStore((state) => state);
  const { messages, setMessages } = messageState;

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
