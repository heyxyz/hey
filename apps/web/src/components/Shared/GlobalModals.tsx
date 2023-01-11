import Report from '@components/Shared/Modal/Report';
import { Modal } from '@components/UI/Modal';
import type { LensterPublication } from '@generated/types';
import { ArrowCircleRightIcon, EmojiHappyIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useAuthStore } from 'src/store/auth';
import { useGlobalModalStateStore } from 'src/store/modals';

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
  const showAuthModal = useAuthStore((state) => state.showAuthModal);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  return (
    <>
      <Modal
        title={t`Report`}
        icon={<ShieldCheckIcon className="w-5 h-5 text-brand" />}
        show={showReportModal}
        onClose={() => setShowReportModal(false, reportPublication)}
      >
        <Report publication={reportPublication as LensterPublication} />
      </Modal>
      <Modal
        title={t`Set status`}
        icon={<EmojiHappyIcon className="w-5 h-5 text-brand" />}
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
        icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      >
        <Login />
      </Modal>
    </>
  );
};

export default GlobalModals;
