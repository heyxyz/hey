import { getProfileFromDID } from '@components/Messages/Push/helper';
import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useFetchLensProfiles from './useFetchLensProfiles';

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setChatsFeed = usePushChatStore((state) => state.setChatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const { loadLensProfiles } = useFetchLensProfiles();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const fetchChats = useCallback(async () => {
    if (!currentProfile) {
      return;
    }
    setLoading(true);
    try {
      const chats = await PushAPI.chat.chats({
        account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
        toDecrypt: decryptedPgpPvtKey ? true : false,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: PUSH_ENV
      });

      const lensIds: Array<string> = [];

      //conversation to map from array
      const modifiedChatsObj: { [key: string]: IFeeds } = {};

      for (const chat of chats) {
        const profileId: string = getProfileFromDID(chat.did ?? chat.chatId);
        if (chat.did) {
          lensIds.push(profileId);
        }
        modifiedChatsObj[chat.did ?? chat.chatId] = chat;
      }

      await loadLensProfiles(lensIds);
      setChatsFeed(modifiedChatsObj);
      return modifiedChatsObj;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentProfile, decryptedPgpPvtKey, loadLensProfiles, setChatsFeed]);

  return { fetchChats, error, loading };
};

export default useFetchChats;
