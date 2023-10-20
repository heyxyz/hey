import { API_URL } from '@hey/data/constants';
import { Subscription } from '@hey/lens/documents/Subscription';
import type { FC } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAppPersistStore } from 'src/store/app';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import { useUpdateEffect } from 'usehooks-ts';

const WebSocketProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  );

  useUpdateEffect(() => {
    if (readyState === 1 && profileId) {
      sendJsonMessage({
        id: '1',
        type: 'start',
        payload: { variables: { for: profileId }, query: Subscription }
      });
    }
  }, [readyState]);

  useUpdateEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}');
    const daData = jsonData?.payload?.data;

    if (profileId && daData && daData?.newNotification?.id) {
      setLatestNotificationId(daData.newNotification.id);
    }
  }, [lastMessage]);

  return null;
};

export default WebSocketProvider;
