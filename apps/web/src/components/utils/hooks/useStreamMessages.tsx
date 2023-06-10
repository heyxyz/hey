import type { DecodedMessage, Stream } from '@xmtp/xmtp-js';
import { useEffect, useRef } from 'react';
import { useMessageStore } from 'src/store/message';

export type MessageStream = Promise<Stream<DecodedMessage>>;

const useStreamMessages = (
  conversationKey: string,
  onMessageCallback?: () => void
) => {
  const conversations = useMessageStore((state) => state.conversations);
  const addMessages = useMessageStore((state) => state.addMessages);
  const streamRef = useRef<MessageStream | undefined>();
  const endStreamRef = useRef(async (stream?: MessageStream) => {
    // it's important to reset the stream reference first so that any
    // subsequent mounts can restart the stream
    if (streamRef.current) {
      streamRef.current = undefined;
    }
    if (stream !== undefined) {
      (await stream).return();
    }
  });

  useEffect(() => {
    const conversation = conversations.get(conversationKey);
    if (!conversation) {
      return;
    }

    // ensure references to the stream and end stream function are available during cleanup
    let stream = streamRef.current;
    const endStream = endStreamRef.current;

    const streamMessages = async () => {
      // don't start a stream if there's already one active
      if (streamRef.current) {
        return;
      }

      try {
        // it's important not to await the stream here so that we can cleanup
        // consistently if this hook unmounts during this call
        streamRef.current = conversation.streamMessages();
        stream = streamRef.current;

        for await (const msg of await stream) {
          const numAdded = addMessages(conversationKey, [msg]);
          if (numAdded > 0 && onMessageCallback) {
            onMessageCallback();
          }
        }
      } catch (error) {
        endStream(stream);
        // re-throw error for upstream consumption
        throw error;
      }
    };

    streamMessages();
    return () => {
      endStream(stream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);
};

export default useStreamMessages;
