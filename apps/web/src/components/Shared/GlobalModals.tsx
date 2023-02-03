import Report from '@components/Shared/Modal/Report';
import { Modal } from '@components/UI/Modal';
import useLoginFlow from '@components/utils/hooks/useLoginFlow';
import { ArrowCircleRightIcon, EmojiHappyIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useEffect } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAuthStore } from 'src/store/auth';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import Login from './Login';
import Status from './Status';
import SwitchProfiles from './SwitchProfiles';

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
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (isConnected) {
      if (chain?.id != CHAIN_ID) {
        switchNetwork?.(CHAIN_ID);
      } else if (loginRequested) {
        handleSign();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chain]);

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
