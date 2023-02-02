import Report from '@components/Shared/Modal/Report';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon, EmojiHappyIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import onError from '@lib/onError';
import { t } from '@lingui/macro';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ERROR_MESSAGE } from 'data/constants';
import { useAuthenticateMutation, useChallengeLazyQuery, useUserProfilesLazyQuery } from 'lens';
import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { useGlobalModalStateStore } from 'src/store/modals';
import { USER } from 'src/tracking';
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi';

import Login from './Login';
import Status from './Status';
import SwitchProfiles from './SwitchProfiles';

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
    console.log('handleSign gm');
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
      Analytics.track(USER.SIWL);
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
    console.log('showLoginFlow gm');
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

const GlobalModals: FC = () => {
  // Report modal state
  const showReportModal = useGlobalModalStateStore((state) => state.showReportModal);
  const reportPublication = useGlobalModalStateStore((state) => state.reportPublication);
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);
  const showStatusModal = useGlobalModalStateStore((state) => state.showStatusModal);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);
  const showProfileSwitchModal = useGlobalModalStateStore((state) => state.showProfileSwitchModal);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);
  const setShowSignupModal = useAuthStore((state) => state.setShowSignupModal);
  const showSignupModal = useAuthStore((state) => state.showSignupModal);
  const loginRequested = useAuthStore((state) => state.loginRequested);
  const { isConnected } = useAccount();
  const { handleSign } = useLoginFlow();

  useEffect(() => {
    if (isConnected && loginRequested) {
      handleSign();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <>
      {reportPublication && (
        <Modal
          title={t`Report`}
          icon={<ShieldCheckIcon className="text-brand h-5 w-5" />}
          show={showReportModal}
          onClose={() => setShowReportModal(false, reportPublication)}
        >
          <Report publication={reportPublication} />
        </Modal>
      )}
      <Modal
        title={t`Set status`}
        icon={<EmojiHappyIcon className="text-brand h-5 w-5" />}
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <Status />
      </Modal>
      <Modal
        title={t`Change Profile`}
        show={showProfileSwitchModal}
        onClose={() => setShowProfileSwitchModal(false)}
        size="xs"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        title={t`Login`}
        icon={<ArrowCircleRightIcon className="text-brand h-5 w-5" />}
        show={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      >
        <Login />
      </Modal>
    </>
  );
};

export default GlobalModals;
