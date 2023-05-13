import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface fetchChat {
  recipientAddress: string;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchChat = useCallback(
    async ({ recipientAddress }: fetchChat) => {
      setLoading(true);
      try {
        const chat = await PushAPI.chat.chat({
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile?.id}`,
          toDecrypt: decryptedPgpPvtKey ? true : false,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          recipient: recipientAddress,
          env: PUSH_ENV
        });
        return chat;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    [decryptedPgpPvtKey]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
