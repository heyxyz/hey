import Report from '@components/Shared/Modal/Report';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon, EmojiHappyIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useAuthStore } from 'src/store/auth';
import { useGlobalModalStateStore } from 'src/store/modals';

import Login from './Login';
import Status from './Status';
import SwitchProfiles from './SwitchProfiles';

export const useLoginFlow = () => {
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const { openConnectModal } = useConnectModal();

  const showLoginFlow = useCallback(() => {
    openConnectModal?.();
    setShowAuthModal(true);
  }, [openConnectModal, setShowAuthModal]);
  return { showLoginFlow };
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
  const showAuthModal = useAuthStore((state) => state.showAuthModal);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const { openConnectModal } = useConnectModal();

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
        show={showAuthModal && !openConnectModal}
        onClose={() => setShowAuthModal(false)}
      >
        <Login />
      </Modal>
    </>
  );
};

export default GlobalModals;
