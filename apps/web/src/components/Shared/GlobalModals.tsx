import NewPublication from '@components/Composer/NewPublication';
import ReportPublication from '@components/Shared/Modal/ReportPublication';
import {
  ArrowCircleRightIcon,
  EmojiHappyIcon,
  ShieldCheckIcon,
  TicketIcon
} from '@heroicons/react/outline';
import { Modal } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

import Login from './Login';
import Invites from './Modal/Invites';
import ReportProfile from './Modal/ReportProfile';
import Status from './Status';
import SwitchProfiles from './SwitchProfiles';

const GlobalModals: FC = () => {
  // Report modal state
  const {
    showPublicationReportModal,
    reportingPublication,
    setShowPublicationReportModal,
    showStatusModal,
    setShowStatusModal,
    showProfileSwitchModal,
    setShowProfileSwitchModal,
    showNewPostModal,
    setShowNewPostModal,
    showAuthModal,
    setShowAuthModal,
    showInvitesModal,
    setShowInvitesModal,
    showReportProfileModal,
    reportingProfile,
    setShowReportProfileModal
  } = useGlobalModalStateStore();

  return (
    <>
      <Modal
        title={t`Report Publication`}
        icon={<ShieldCheckIcon className="text-brand h-5 w-5" />}
        show={showPublicationReportModal}
        onClose={() =>
          setShowPublicationReportModal(false, reportingPublication)
        }
      >
        <ReportPublication publication={reportingPublication} />
      </Modal>
      <Modal
        title={t`Report Profile`}
        icon={<ShieldCheckIcon className="text-brand h-5 w-5" />}
        show={showReportProfileModal}
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
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
      <Modal
        title={t`Invites`}
        icon={<TicketIcon className="text-brand h-5 w-5" />}
        show={showInvitesModal}
        onClose={() => setShowInvitesModal(false)}
      >
        <Invites />
      </Modal>
    </>
  );
};

export default GlobalModals;
