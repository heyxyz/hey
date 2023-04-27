import type { IMessageIPFS } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface HistoryMessagesParams {
  threadhash: string;
  chatId: string;
  limit?: number;
}

const useGetHistoryMessages = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const addChat = usePushChatStore((state) => state.addChat);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const historyMessages = useCallback(
    async ({
      threadhash,
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
          threadhash,
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
          toDecrypt: true,
          pgpPrivateKey: decryptedPgpPvtKey,
          limit: limit,
          env: PUSH_ENV
        });
        setLoading(false);

        addChat(chatId, chatHistory);
        return chatHistory;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [decryptedPgpPvtKey]
  );
  return { historyMessages, error, loading };
};

export default useGetHistoryMessages;
