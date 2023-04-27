import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const requests = await PushAPI.chat.requests({
        account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
        toDecrypt: true,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: PUSH_ENV
      });
      //conversation to map from array
      const mappedRequests = new Map(requests.map((request) => [request.chatId as string, request]));
      setRequestsFeed(mappedRequests);
      return mappedRequests;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  }, [decryptedPgpPvtKey]);

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
