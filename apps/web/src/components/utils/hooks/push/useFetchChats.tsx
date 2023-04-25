import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface fetchChats {
  account: string;
}

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchChats = useCallback(
    async ({ account }: fetchChats) => {
      setLoading(true);
      try {
        const chats = await PushAPI.chat.chats({
          account: `eip155:${account}`,
          toDecrypt: true,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          env: PUSH_ENV
        });
        return chats;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [decryptedPgpPvtKey]
  );

  return { fetchChats, error, loading };
};

export default useFetchChats;
