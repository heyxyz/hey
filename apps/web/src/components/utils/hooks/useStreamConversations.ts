import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { useEffect, useRef } from 'react';

import useXmtpClient from './useXmtpClient';

export type ConversationStream = Promise<Stream<Conversation>>;

/**
 * This hook listens for new conversations in real-time and calls the passed
 * callback when a new conversation is created. It also exposes an error state.
 */
export const useStreamConversations = (
  onConversation: (conversation: Conversation) => void
) => {
  const { client } = useXmtpClient();
  const streamRef = useRef<ConversationStream | undefined>();
  const endStreamRef = useRef(async (stream?: ConversationStream) => {
    // it's important to reset the stream reference first so that any
    // subsequent mounts can restart the stream
    if (streamRef.current) {
      streamRef.current = undefined;
    }
    if (stream !== undefined) {
      (await stream).return();
    }
  });

  /**
   * Attempt to stream conversations on mount
   */
  useEffect(() => {
    // ensure references to the stream and end stream function are available during cleanup
    let stream = streamRef.current;
    const endStream = endStreamRef.current;

    const streamConversations = async () => {
      // client is required
      if (client === undefined) {
        return;
      }

      // don't start a stream if there's already one active
      if (streamRef.current) {
        return;
      }

      try {
        // it's important not to await the stream here so that we can cleanup
        // consistently if this hook unmounts during this call
        streamRef.current = client.conversations.stream();
        stream = streamRef.current;

        for await (const conversation of await stream) {
          onConversation(conversation);
        }
      } catch (error_) {
        endStream(stream);
        // re-throw error for upstream consumption
        throw error_;
      }
    };

    void streamConversations();

    // end streaming on unmount
    return () => {
      endStream(stream);
    };
  }, [onConversation, client]);
};
