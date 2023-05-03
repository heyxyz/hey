import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data';
import { useCallback } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';

const useGetChatProfile = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setConnectedProfile = usePushChatStore((state) => state.setConnectedProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const fetchChatProfile = useCallback(async (): Promise<PushAPI.IUser | undefined> => {
    if (!currentProfile || decryptedPgpPvtKey) {
      return;
    }
    try {
      const did = `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`;
      const profile = await PushAPI.user.get({
        env: PUSH_ENV,
        account: did
      });
      setConnectedProfile(profile);
      return profile;
    } catch (error) {
      console.log(error);
    }
  }, [currentProfile, decryptedPgpPvtKey, setConnectedProfile]);

  return { fetchChatProfile };
};

export default useGetChatProfile;
