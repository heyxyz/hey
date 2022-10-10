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
          const newMessages = messages.get(conversation.peerAddress) ?? [];
          newMessages.push(msg);
          const uniqueMessages = [
            ...Array.from(new Map(newMessages.map((item) => [item['id'], item])).values())
          ];
          messages.set(conversation.peerAddress, uniqueMessages);
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
