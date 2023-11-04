import { WEBSOCKET_WORKER_URL } from '@hey/data/constants';
import type { FC } from 'react';
import useWebSocket from 'react-use-websocket';
import { useLeafwatchPersistStore } from 'src/store/useLeafwatchPersistStore';
import { useLeafwatchStore } from 'src/store/useLeafwatchStore';
import { useEffectOnce, useInterval, useUpdateEffect } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const { viewerId, setViewerId } = useLeafwatchPersistStore();
  const { viewedPublication } = useLeafwatchStore();

  const { sendJsonMessage, readyState } = useWebSocket(WEBSOCKET_WORKER_URL);

  useEffectOnce(() => {
    sendJsonMessage({
      id: '1',
      type: 'connection_init'
    });
    if (!viewerId) {
      setViewerId(uuid());
    }
  });

  useInterval(() => {
    sendJsonMessage({
      id: '2',
      type: 'ka'
    });
  }, 10000);

  useUpdateEffect(() => {
    if (readyState === 1 && viewedPublication) {
      sendJsonMessage({
        id: '3',
        type: 'start',
        payload: JSON.stringify({
          viewer_id: viewerId,
          publication_id: viewedPublication
        })
      });
    }
  }, [readyState, viewedPublication]);

  return null;
};

export default LeafwatchProvider;
