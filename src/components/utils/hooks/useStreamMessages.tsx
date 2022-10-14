import getUniqueMessages from '@lib/getUniqueMessages';
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
    const streamMessages = async () => {
      const newStream = await conversation.streamMessages();
      setStream(newStream);
      for await (const msg of newStream) {
        if (setMessages) {
          const conversationAddress = conversation.peerAddress.toLowerCase();
          const oldMessages = messages.get(conversationAddress) ?? [];
          oldMessages.push(msg);
          const uniqueMessages = getUniqueMessages(oldMessages);
          messages.set(conversationAddress, uniqueMessages);
          setMessages(new Map(messages));
        }
        if (onMessageCallback) {
          onMessageCallback();
        }
      }
    };
    streamMessages();
    return () => {
      const closeStream = async () => {
        if (!stream) {
          return;
        }
        await stream.return();
      };
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);
};

export default useStreamMessages;
