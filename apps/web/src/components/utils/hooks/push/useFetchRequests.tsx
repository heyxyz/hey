import { getProfileFromDID } from '@components/Messages/Push/helper';
import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

import useFetchLensProfiles from './useFetchLensProfiles';

interface fetchRequestsType {
  page: number;
  requestLimit: number;
}

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const { loadLensProfiles } = useFetchLensProfiles();

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const fetchRequests = useCallback(
    async ({ page, requestLimit }: fetchRequestsType) => {
      if (!currentProfile) {
        return;
      }
      if (page === 1) {
        setLoading(true);
      }
      setLoading(true);
      try {
        const requests = await PushAPI.chat.requests({
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
          toDecrypt: decryptedPgpPvtKey ? true : false,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          env: PUSH_ENV,
          page: page,
          limit: requestLimit
        });

        const lensIds: Array<string> = [];

        //conversation to map from array
        const modifiedRequestsObj: { [key: string]: IFeeds } = {};

        for (const request of requests) {
          const profileId: string = getProfileFromDID(request.did ?? request.chatId);
          if (request.did) {
            lensIds.push(profileId);
          }
          modifiedRequestsObj[request.did ?? request.chatId] = request;
        }

        await loadLensProfiles(lensIds);
        return modifiedRequestsObj;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [currentProfile, decryptedPgpPvtKey, loadLensProfiles, setRequestsFeed]
  );

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
