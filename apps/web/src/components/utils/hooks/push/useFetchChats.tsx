import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import type { Profile } from 'lens';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setChatsFeed = usePushChatStore((state) => state.setChatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const chats = await PushAPI.chat.chats({
        account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${(currentProfile as Profile)?.id}`,
        toDecrypt: true,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: PUSH_ENV
      });
      //conversation to map from array
      const mappedChats = new Map(chats.map((chat) => [chat.chatId as string, chat]));
      setChatsFeed(mappedChats);
      return mappedChats;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  }, [decryptedPgpPvtKey]);

  return { fetchChats, error, loading };
};

export default useFetchChats;
