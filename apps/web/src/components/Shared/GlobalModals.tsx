import NewPublication from '@components/Composer/NewPublication';
import ReportPublication from '@components/Shared/Modal/ReportPublication';
import {
  ArrowRightCircleIcon,
  FaceSmileIcon,
  ShieldCheckIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { Modal } from '@hey/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { usePublicationStore } from 'src/store/publication';

import Login from './Login';
import WrongNetwork from './Login/WrongNetwork';
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
    showWrongNetworkModal,
    setShowWrongNetworkModal,
    showInvitesModal,
    setShowInvitesModal,
    showReportProfileModal,
    reportingProfile,
    setShowReportProfileModal,
    setShowDiscardModal
  } = useGlobalModalStateStore();

  const {
    publicationContent,
    attachments,
    isUploading,
    videoDurationInSeconds,
    videoThumbnail,
    audioPublication,
    quotedPublication,
    showPollEditor,
    pollConfig
  } = usePublicationStore();

  const checkIfPublicationNotDrafted = () => {
    if (
      publicationContent === '' &&
      quotedPublication === null &&
      attachments.length === 0 &&
      audioPublication.title === '' &&
      videoThumbnail.url === '' &&
      videoDurationInSeconds === '' &&
      !showPollEditor &&
      !isUploading &&
      pollConfig.choices[0] === ''
    ) {
      return true;
    }
    return false;
  };

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
        title={t`Report profile`}
        icon={<ShieldCheckIcon className="text-brand h-5 w-5" />}
        show={showReportProfileModal}
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
      <Modal
        title={t`Set status`}
        icon={<FaceSmileIcon className="text-brand h-5 w-5" />}
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
        icon={<ArrowRightCircleIcon className="text-brand h-5 w-5" />}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        dataTestId="login-modal"
      >
        <Login />
      </Modal>
      <Modal
        title={t`Wrong Network`}
        show={showWrongNetworkModal}
        onClose={() => setShowWrongNetworkModal(false)}
        dataTestId="wrong-network-modal"
      >
        <WrongNetwork />
      </Modal>
      <Modal
        title={t`Create post`}
        size="md"
        show={showNewPostModal}
        onClose={() => {
          if (checkIfPublicationNotDrafted()) {
            setShowNewPostModal(false);
          } else {
            setShowDiscardModal(true);
          }
        }}
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
