import type { IMessageIPFS } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface HistoryMessagesParams {
  threadHash: string;
  chatId: string;
  limit?: number;
}

const useGetHistoryMessages = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const chats = usePushChatStore((state) => state.chats);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const addChat = usePushChatStore((state) => state.addChat);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const historyMessages = useCallback(
    async ({
      threadHash,
      chatId,
      limit = 10
    }: HistoryMessagesParams): Promise<IMessageIPFS[] | undefined> => {
      if (!decryptedPgpPvtKey) {
        setError('something went wrong');
        return undefined;
      }
      setLoading(true);
      try {
        const chatHistory = await PushAPI.chat.history({
          threadhash: threadHash,
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
          toDecrypt: true,
          pgpPrivateKey: decryptedPgpPvtKey,
          limit: limit,
          env: PUSH_ENV
        });
        chatHistory.sort((a, b) => {
          return a.timestamp! > b.timestamp! ? 1 : -1;
        });
        if (chats.get(chatId)) {
          addChat(chatId, {
            messages: [...chatHistory, ...chats.get(chatId)!.messages],
            lastThreadHash: chatHistory[0].link
          });
        } else {
          addChat(chatId, { messages: chatHistory, lastThreadHash: chatHistory[0].link });
        }
        setLoading(false);
        return chatHistory;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [decryptedPgpPvtKey, chats]
  );
  return { historyMessages, error, loading };
};

export default useGetHistoryMessages;
