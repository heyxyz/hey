import type { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

const useStreamMessages = (
  conversationKey: string,
  conversation?: Conversation,
  onMessageCallback?: () => void
) => {
  const addMessages = useMessageStore((state) => state.addMessages);
  const [stream, setStream] = useState<Stream<DecodedMessage>>();

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
        const numAdded = addMessages(conversationKey, [msg]);
        if (numAdded > 0 && onMessageCallback) {
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
