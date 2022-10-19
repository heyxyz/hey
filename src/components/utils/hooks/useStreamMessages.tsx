import type { Conversation, Stream } from '@xmtp/xmtp-js';
import type { MessageV1, MessageV2 } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

// Todo: Fix these types in XMTP-JS
type MessageStream = Stream<MessageV1> | Stream<MessageV2>;

const useStreamMessages = (
  conversationKey: string,
  conversation?: Conversation,
  onMessageCallback?: () => void
) => {
  const addMessages = useMessageStore((state) => state.addMessages);
  const [stream, setStream] = useState<MessageStream>();

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
