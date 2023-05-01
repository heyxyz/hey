import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

const CHAT_SOCKET_TYPE = 'chat';

interface PushChatSocket {
  isSDKSocketConnected: boolean;
  messagesSinceLastConnection: any; // replace any with the actual type of messages
  groupInformationSinceLastConnection: any; // replace any with the actual type of group information
}

const usePushChatSocket = (): PushChatSocket => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pushChatSocket = usePushChatStore((state) => state.pushChatSocket);
  const setPushChatSocket = usePushChatStore((state) => state.setPushChatSocket);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState<boolean>(false);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [groupInformationSinceLastConnection, setGroupInformationSinceLastConnection] = useState<any>('');

  const addSocketEvents = useCallback(() => {
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsSDKSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, () => {
      setIsSDKSocketConnected(false);
    });

    pushChatSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (chat: any) => {
      setMessagesSinceLastConnection(chat);
    });

    pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
      setGroupInformationSinceLastConnection(groupInfo);
    });
  }, [pushChatSocket]);

  const removeSocketEvents = useCallback(() => {
    pushChatSocket?.off(EVENTS.CONNECT);
    pushChatSocket?.off(EVENTS.DISCONNECT);
    pushChatSocket?.off(EVENTS.CHAT_GROUPS);
    pushChatSocket?.off(EVENTS.CHAT_RECEIVED_MESSAGE);
  }, [pushChatSocket]);

  useEffect(() => {
    if (pushChatSocket) {
      addSocketEvents();
    }

    return () => {
      if (pushChatSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, pushChatSocket, removeSocketEvents]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (currentProfile) {
      if (pushChatSocket) {
        pushChatSocket?.disconnect();
      }

      const user = `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`;

      // this is auto-connect on instantiation
      const connectionObject = createSocketConnection({
        user,
        socketType: CHAT_SOCKET_TYPE,
        env: PUSH_ENV
      });
      setPushChatSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    isSDKSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection
  };
};

export default usePushChatSocket;
