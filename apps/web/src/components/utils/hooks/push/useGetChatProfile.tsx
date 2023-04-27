import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { usePushChatStore } from 'src/store/push-chat';

const useGetChatProfile = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setConnectedProfile = usePushChatStore((state) => state.setConnectedProfile);
  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    const fetchChatProfile = async () => {
      // try {
      //   const did = `eip155:${CHAIN_ID}:${LENSHUB_PROXY}:nft:${currentProfile.id}`;
      //   const profile = await PushAPI.user.getNFTProfile({
      //     env: PUSH_ENV,
      //     did: did
      //   });
      //   setConnectedProfile(profile);
      // } catch (error) {
      //   console.log(error);
      // }
    };
    fetchChatProfile();
  }, [connectedProfile, currentProfile, setConnectedProfile]);
  return { connectedProfile };
};

export default useGetChatProfile;
