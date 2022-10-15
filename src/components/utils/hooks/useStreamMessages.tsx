import type { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

const useStreamMessages = (conversation?: Conversation, onMessageCallback?: () => void) => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const [stream, setStream] = useState<Stream<Message>>();

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const closeStream = async () => {
      if (!stream) {
        return;
      }
      await stream.return();
    };
    const streamMessages = async () => {
      closeStream();
      const newStream = await conversation.streamMessages();
      setStream(newStream);
      for await (const msg of newStream) {
        if (setMessages) {
          const conversationAddress = conversation.peerAddress.toLowerCase();
          const oldMessages = messages.get(conversationAddress) ?? [];
          oldMessages.unshift(msg);
          messages.set(conversationAddress, oldMessages);
          setMessages(new Map(messages));
        }
        if (onMessageCallback) {
          onMessageCallback();
        }
      }
    };
    streamMessages();
    return () => {
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);
};

export default useStreamMessages;
