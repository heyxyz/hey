import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface fetchRequests {
  account: string;
}

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchRequests = useCallback(
    async ({ account }: fetchRequests) => {
      setLoading(true);
      try {
        const chats = await PushAPI.chat.requests({
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

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
