import type { DecodedMessage } from '@xmtp/xmtp-js';
import { useEffect, useRef } from 'react';

import useXmtpClient from './useXmtpClient';

export type AllMessagesStream = Promise<AsyncGenerator<DecodedMessage>>;

/**
 * This hook streams new messages from all conversations on mount and exposes
 * an error state.
 */
export const useStreamAllMessages = (
  onMessage: (message: DecodedMessage) => void
) => {
  const { client } = useXmtpClient();
  const streamRef = useRef<AllMessagesStream>();
  const endStreamRef = useRef(async (stream?: AllMessagesStream) => {
    // it's important to reset the stream reference first so that any
    // subsequent mounts can restart the stream
    if (streamRef.current) {
      streamRef.current = undefined;
    }
    if (stream !== undefined) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      (await stream).return(undefined);
    }
  });

  // attempt to stream conversation messages on mount
  useEffect(() => {
    // ensure references to the stream and end stream function are available
    // during cleanup
    let stream = streamRef.current;
    const endStream = endStreamRef.current;

    const streamAllMessages = async () => {
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
        streamRef.current = client.conversations.streamAllMessages();
        stream = streamRef.current;

        for await (const message of await (stream as AllMessagesStream)) {
          onMessage(message);
        }
      } catch (error_) {
        endStream(stream);
        // re-throw error for upstream consumption
        throw error_;
      }
    };

    void streamAllMessages();

    // end streaming on unmount
    return () => {
      endStream(stream);
    };
  }, [onMessage, client]);
};
