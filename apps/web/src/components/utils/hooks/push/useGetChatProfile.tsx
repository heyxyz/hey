import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

interface GetProfileParams {
  profileId: string;
}

const useGetChatProfile = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setConnectedProfile = usePushChatStore((state) => state.setConnectedProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchChatProfile = useCallback(
    async ({ profileId }: GetProfileParams): Promise<PushAPI.IUser | undefined> => {
      if (currentProfile?.id === profileId && decryptedPgpPvtKey) {
        return;
      }
      try {
        const did = `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${profileId}`;
        const profile = await PushAPI.user.get({
          env: PUSH_ENV,
          account: did
        });
        if (currentProfile?.id === profileId) {
          setConnectedProfile(profile);
        }
        return profile;
      } catch (error) {
        console.log(error);
      }
    },
    [currentProfile, decryptedPgpPvtKey, setConnectedProfile]
  );

  return { fetchChatProfile };
};

export default useGetChatProfile;
