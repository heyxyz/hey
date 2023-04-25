import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface fetchChat {
  account: string;
  recipientAddress: string;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchChat = useCallback(
    async ({ account, recipientAddress }: fetchChat) => {
      setLoading(true);
      try {
        const conversationHash = await PushAPI.chat.conversationHash({
          account: `eip155:${account}`,
          conversationId: `eip155:${recipientAddress}`, // receiver's address or chatId of a group
          env: PUSH_ENV
        });

        const chatHistory = await PushAPI.chat.latest({
          threadhash: conversationHash.threadHash,
          account: `eip155:${account}`,
          toDecrypt: true,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          env: PUSH_ENV
        });
        return chatHistory;
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
