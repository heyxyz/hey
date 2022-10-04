import { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useXmtpStore } from 'src/store/xmtp';

let stream: Stream<Message>;

const useStreamMessages = (conversation: Conversation, onMessageCallback: () => void) => {
  const xmtpState = useXmtpStore((state) => state);
  const { messages, setMessages } = xmtpState;

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const streamMessages = async () => {
      stream = await conversation.streamMessages();
      for await (const msg of stream) {
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
