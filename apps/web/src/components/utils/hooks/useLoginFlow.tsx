import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ERROR_MESSAGE } from 'data/constants';
import { useAuthenticateMutation, useChallengeLazyQuery, useUserProfilesLazyQuery } from 'lens';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { AUTH } from 'src/tracking';
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';

export const useLoginFlow = () => {
  const { openConnectModal } = useConnectModal();

  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowSignupModal = useAuthStore((state) => state.setShowSignupModal);
  const setLoginRequested = useAuthStore((state) => state.setLoginRequested);
  const setSigningInProgress = useAuthStore((state) => state.setSigningInProgress);

  const { chain } = useNetwork();
  const { address, connector, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const { switchNetwork } = useSwitchNetwork();
  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate] = useAuthenticateMutation();
  const [getProfiles] = useUserProfilesLazyQuery();

  const handleSign = useCallback(async () => {
    try {
      setSigningInProgress(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERROR_MESSAGE);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } }
      });
      localStorage.setItem('accessToken', auth.data?.authenticate.accessToken);
      localStorage.setItem('refreshToken', auth.data?.authenticate.refreshToken);

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address }
      });

      if (profilesData?.profiles?.items?.length === 0) {
        setShowSignupModal(true);
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
      Mixpanel.track(AUTH.SIWL);
    } catch (error) {
      console.error(error);
    } finally {
      setSigningInProgress(false);
    }
  }, [
    address,
    authenticate,
    getProfiles,
    loadChallenge,
    setCurrentProfile,
    setProfileId,
    setProfiles,
    setShowSignupModal,
    setSigningInProgress,
    signMessageAsync
  ]);

  const showLoginFlow = useCallback(() => {
    setLoginRequested(true);
    if (openConnectModal) {
      openConnectModal();
      return;
    }

    if (chain?.id === CHAIN_ID) {
      if (connector?.id && isConnected) {
        handleSign();
      }
    } else {
      switchNetwork?.(CHAIN_ID);
    }
  }, [chain?.id, connector?.id, handleSign, isConnected, openConnectModal, setLoginRequested, switchNetwork]);

  return { showLoginFlow, handleSign };
};

export default useLoginFlow;
