import type { IMessageIPFS } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface HistoryMessagesParams {
  account: string;
  threadhash: string;
  toDecrypt?: boolean;
  limit?: number;
}

const useGetHistoryMessages = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const historyMessages = useCallback(
    async ({
      account,
      threadhash,
      toDecrypt = true,
      limit = 10
    }: HistoryMessagesParams): Promise<IMessageIPFS[] | undefined> => {
      if (!decryptedPgpPvtKey) {
        setError('something went wrong');
        return undefined;
      }
      setLoading(true);
      try {
        const response = await PushAPI.chat.history({
          threadhash,
          account,
          toDecrypt: toDecrypt,
          pgpPrivateKey: decryptedPgpPvtKey,
          limit: limit,
          env: PUSH_ENV
        });
        setLoading(false);
        return response;
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
