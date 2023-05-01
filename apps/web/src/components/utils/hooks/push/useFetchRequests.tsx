import { getProfileFromDID } from '@components/Messages/Push/helper';
import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useFetchLensProfiles from './useFetchLensProfiles';

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const { loadLensProfiles } = useFetchLensProfiles();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const fetchRequests = useCallback(async () => {
    if (!currentProfile) {
      return;
    }
    setLoading(true);
    try {
      const chats = await PushAPI.chat.requests({
        account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
        toDecrypt: true,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: PUSH_ENV
      });

      const lensIds: Array<string> = [];

      //conversation to map from array
      const modifiedChatsObj: { [key: string]: IFeeds } = {};

      for (const chat of chats) {
        const profileId: string = getProfileFromDID(chat.did);
        lensIds.push(profileId);
        modifiedChatsObj[profileId] = chat;
      }

      await loadLensProfiles(lensIds);
      setRequestsFeed(modifiedChatsObj);
      return modifiedChatsObj;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentProfile, decryptedPgpPvtKey, loadLensProfiles, setRequestsFeed]);

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
