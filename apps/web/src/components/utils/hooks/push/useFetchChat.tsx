import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePushChatStore } from 'src/store/push-chat';

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
      // try {
      //   const chat = await PushAPI.chat.chat({
      //     account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
      //     toDecrypt: true,
      //     pgpPrivateKey: String(decryptedPgpPvtKey),
      //     recipient:recipientAddress,
      //     env: PUSH_ENV
      //   });
      //   return chat;
      // } catch (error: Error | any) {
      //   setLoading(false);
      //   setError(error.message);
      //   console.log(error);
      // }
    },
    [decryptedPgpPvtKey]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
