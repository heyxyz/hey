import NewPublication from '@components/Composer/NewPublication';
import Report from '@components/Shared/Modal/Report';
import {
  ArrowCircleRightIcon,
  EmojiHappyIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/react/outline';
import { Modal } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

import Login from './Login';
import ProtectProfile from './ProtectProfile';
import Status from './Status';
import SwitchProfiles from './SwitchProfiles';

const GlobalModals: FC = () => {
  // Report modal state
  const {
    showReportModal,
    reportingPublication,
    setShowReportModal,
    showStatusModal,
    setShowStatusModal,
    showProfileSwitchModal,
    setShowProfileSwitchModal,
    showNewPostModal,
    setShowNewPostModal,
    showAuthModal,
    setShowAuthModal
  } = useGlobalModalStateStore();

  const profileGuardianInformation = useAppStore(
    (state) => state.profileGuardianInformation
  );

  return (
    <>
      {reportingPublication ? (
        <Modal
          title={t`Report`}
          icon={<ShieldCheckIcon className="text-brand h-5 w-5" />}
          show={showReportModal}
          onClose={() => setShowReportModal(false, reportingPublication)}
        >
          <Report publication={reportingPublication} />
        </Modal>
      ) : null}
      <Modal
        title={t`Set status`}
        icon={<EmojiHappyIcon className="text-brand h-5 w-5" />}
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <Status />
      </Modal>
      <Modal
        title={t`Profile Guardian`}
        icon={<LockClosedIcon className="text-brand h-5 w-5" />}
        show={!profileGuardianInformation.isProtected}
      >
        <ProtectProfile />
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
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        dataTestId="login-modal"
      >
        <Login />
      </Modal>
      <Modal
        title={t`Create post`}
        size="md"
        show={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
      >
        <NewPublication />
      </Modal>
    </>
  );
};

export default GlobalModals;
