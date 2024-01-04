import type { EVENTS } from '@pushprotocol/restapi';
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import type { Socket } from 'socket.io-client';

import { PUSH_ENV } from '@hey/data/constants';
import { createSocketConnection } from '@pushprotocol/socket';
import { useEffect, useState } from 'react';

export const usePushStream = ({
  account,
  autoConnect,
  callback,
  filters
}: {
  account: string;
  autoConnect?: boolean;
  callback: (event: EVENTS, data: unknown) => Promise<void> | void;
  events?: EVENTS;
  filters?: unknown;
}) => {
  const [stream, setStream] = useState<null | Socket<
    DefaultEventsMap,
    DefaultEventsMap
  >>(null);

  useEffect(() => {
    if (!account) {
      return;
    }

    if (stream?.connected) {
      // the below lines ensures that we're always having latest updated callback into the listener
      stream.removeAllListeners();
      stream.onAny(callback);
      return;
    }

    const _stream = createSocketConnection({
      env: PUSH_ENV,
      socketOptions: {
        autoConnect: autoConnect ?? false,
        reconnectionAttempts: 2,
        reconnectionDelay: 5000
      },
      socketType: 'chat',
      user: account
    });

    if (autoConnect) {
      _stream?.connect();
    }

    setStream(_stream);

    return () => {
      if (stream?.connected) {
        stream.disconnect();
      }
    };
    // No need to add `stream` as dependency, causing unwanted re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, callback, autoConnect]);

  return { stream };
};
