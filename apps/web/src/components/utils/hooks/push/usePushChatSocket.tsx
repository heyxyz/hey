import { isCAIP } from '@components/Messages/Push/helper';
import type { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useFetchChat from './useFetchChat';

const CHAT_SOCKET_TYPE = 'chat';

interface PushChatSocket {
  isSDKSocketConnected: boolean;
  messagesSinceLastConnection: any; // replace any with the actual type of messages
  groupInformationSinceLastConnection: any; // replace any with the actual type of group information
}

const usePushChatSocket = (): PushChatSocket => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pushChatSocket = usePushChatStore((state) => state.pushChatSocket);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setPushChatSocket = usePushChatStore((state) => state.setPushChatSocket);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState<boolean>(false);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [groupInformationSinceLastConnection, setGroupInformationSinceLastConnection] = useState<any>('');
  const { fetchChat } = useFetchChat();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setChat = usePushChatStore((state) => state.setChat);
  const setChatFeed = usePushChatStore((state) => state.setChatFeed);
  const setRequestFeed = usePushChatStore((state) => state.setRequestFeed);
  const chats = usePushChatStore((state) => state.chats);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const addSocketEvents = useCallback(() => {
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsSDKSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, () => {
      setIsSDKSocketConnected(false);
    });

    pushChatSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (chat: IMessageIPFS) => {
      if (!connectedProfile || !decryptedPgpPvtKey) {
        return;
      }
      if (chat.fromDID === connectedProfile.did) {
        return;
      }

      const response = await PushAPI.chat.decryptConversation({
        messages: [chat],
        connectedUser: connectedProfile,
        pgpPrivateKey: decryptedPgpPvtKey,
        env: PUSH_ENV
      });

      if (response && response.length) {
        const msg = response[0];
        const chatId = !isCAIP(msg.toDID) ? msg.toDID : msg.fromDID;

        if (chatsFeed[chatId]) {
          let newOne: IFeeds = chatsFeed[chatId];
          setChat(chatId, {
            messages: [...chats.get(chatId)!.messages, msg],
            lastThreadHash: chats.get(chatId)!.lastThreadHash
          });

          newOne['msg'] = msg;
          setChatFeed(chatId, newOne);
        } else if (requestsFeed[chatId]) {
          let newOne: IFeeds = requestsFeed[chatId];
          setChat(chatId, {
            messages: [...chats.get(chatId)!.messages, msg],
            lastThreadHash: chats.get(chatId)!.lastThreadHash
          });

          newOne['msg'] = msg;
          setRequestFeed(chatId, newOne);
        } else {
          let fetchChatsMessages: IFeeds = (await fetchChat({ recipientAddress: chatId })) as IFeeds;
          setChatFeed(chatId, fetchChatsMessages);
          setChat(chatId, {
            messages: Array.isArray(chats.get(chatId)?.messages)
              ? [...chats.get(chatId)!.messages, msg]
              : [msg],
            lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link
          });
        }
      }
      setMessagesSinceLastConnection(chat);
    });

    pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
      console.log(groupInfo);
      setGroupInformationSinceLastConnection(groupInfo);
    });
  }, [
    pushChatSocket,
    connectedProfile,
    decryptedPgpPvtKey,
    chatsFeed,
    requestsFeed,
    setChat,
    chats,
    setChatFeed,
    setRequestFeed,
    fetchChat
  ]);

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
  }, [currentProfile, connectedProfile, decryptedPgpPvtKey]);

  return {
    isSDKSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection
  };
};

export default usePushChatSocket;
