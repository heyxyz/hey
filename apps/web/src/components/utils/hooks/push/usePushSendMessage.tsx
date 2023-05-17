import { getCAIPFromLensID } from '@components/Messages/Push/helper';
import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useEthersWalletClient from '../useEthersWalletClient';
import useFetchChat from './useFetchChat';

interface SendMessageParams {
  message: string;
  receiver: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaURL';
}

const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const chats = usePushChatStore((state) => state.chats);
  const setChat = usePushChatStore((state) => state.setChat);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const setChatFeed = usePushChatStore((state) => state.setChatFeed);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: walletClient } = useEthersWalletClient();
  const { fetchChat } = useFetchChat();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const sendMessage = useCallback(
    async ({
      message,
      receiver,
      messageType = 'Text'
    }: SendMessageParams): Promise<boolean | undefined> => {
      if (!currentProfile) {
        return;
      }
      if (!decryptedPgpPvtKey || !message || !walletClient) {
        setError('something went wrong');
        return false;
      }
      setLoading(true);
      try {
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: messageType,
          receiverAddress: receiver,
          account: getCAIPFromLensID(currentProfile.id),
          pgpPrivateKey: decryptedPgpPvtKey,
          env: PUSH_ENV
        });
        setLoading(false);
        if (!response) {
          return false;
        }

        const modifiedResponse = { ...response, messageContent: message };
        if (chatsFeed[selectedChatId]) {
          let newOne: IFeeds = chatsFeed[selectedChatId];
          setChat(selectedChatId, {
            messages: Array.isArray(chats.get(selectedChatId)?.messages)
              ? [...chats.get(selectedChatId)!.messages, modifiedResponse]
              : [modifiedResponse],
            lastThreadHash:
              chats.get(selectedChatId)?.lastThreadHash ?? response.link
          });

          newOne['msg'] = modifiedResponse;
          setChatFeed(selectedChatId, newOne);
        } else {
          let fetchChatsMessages: IFeeds = (await fetchChat({
            recipientAddress: receiver
          })) as IFeeds;
          setChatFeed(selectedChatId, fetchChatsMessages);
          setChat(selectedChatId, {
            messages: Array.isArray(chats.get(selectedChatId)?.messages)
              ? [...chats.get(selectedChatId)!.messages, modifiedResponse]
              : [modifiedResponse],
            lastThreadHash:
              chats.get(selectedChatId)?.lastThreadHash ?? response.link
          });
        }

        return true;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [
      currentProfile,
      decryptedPgpPvtKey,
      walletClient,
      setChat,
      selectedChatId,
      chats
    ]
  );
  return { sendMessage, error, loading };
};

export default usePushSendMessage;
