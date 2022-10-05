import { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useXmtpStore } from 'src/store/xmtp';

const useStreamMessages = (conversation: Conversation, onMessageCallback: () => void) => {
  const xmtpState = useXmtpStore((state) => state);
  const { messages, setMessages } = xmtpState;
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

  const sendMessage = async (message: string) => {
    if (!conversation) {
      return;
    }
    await conversation.send(message);
  };

  return {
    sendMessage
  };
};

export default useStreamMessages;
