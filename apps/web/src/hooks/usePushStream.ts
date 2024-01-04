import type { EVENTS } from '@pushprotocol/restapi';
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import type { Socket } from 'socket.io-client';

import { PUSH_ENV } from '@hey/data/constants';
import { createSocketConnection } from '@pushprotocol/socket';
import { useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

export const usePushStream = ({
  account,
  autoConnect,
  callback,
  filters
}: {
  account: string;
  autoConnect?: boolean;
  callback: (event: unknown) => void;
  events?: EVENTS;
  filters?: unknown;
}) => {
  const [stream, setStream] = useState<null | Socket<
    DefaultEventsMap,
    DefaultEventsMap
  >>(null);

  useUpdateEffect(() => {
    if (!account) {
      return;
    }

    if (stream?.connected) {
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

    setStream(_stream);

    return () => {
      if (stream?.connected) {
        stream.disconnect();
      }
    };
  }, [account, callback, autoConnect, stream]);

  return { stream };
};
