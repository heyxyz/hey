import type { FC } from 'react';

import NewPublication from '@components/Composer/NewPublication';
import ReportPublication from '@components/Shared/Modal/ReportPublication';
import {
  ArrowRightCircleIcon,
  ShieldCheckIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { Modal } from '@hey/ui';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

import Login from './Login';
import WrongNetwork from './Login/WrongNetwork';
import Invites from './Modal/Invites';
import ReportProfile from './Modal/ReportProfile';
import SwitchProfiles from './SwitchProfiles';

const GlobalModals: FC = () => {
  // Report modal state
  const showPublicationReportModal = useGlobalModalStateStore(
    (state) => state.showPublicationReportModal
  );
  const reportingPublication = useGlobalModalStateStore(
    (state) => state.reportingPublication
  );
  const setShowPublicationReportModal = useGlobalModalStateStore(
    (state) => state.setShowPublicationReportModal
  );
  const showProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.showProfileSwitchModal
  );
  const setShowProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.setShowProfileSwitchModal
  );
  const showNewPostModal = useGlobalModalStateStore(
    (state) => state.showNewPostModal
  );
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const showAuthModal = useGlobalModalStateStore(
    (state) => state.showAuthModal
  );
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const showWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.showWrongNetworkModal
  );
  const setShowWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.setShowWrongNetworkModal
  );
  const showInvitesModal = useGlobalModalStateStore(
    (state) => state.showInvitesModal
  );
  const setShowInvitesModal = useGlobalModalStateStore(
    (state) => state.setShowInvitesModal
  );
  const showReportProfileModal = useGlobalModalStateStore(
    (state) => state.showReportProfileModal
  );
  const reportingProfile = useGlobalModalStateStore(
    (state) => state.reportingProfile
  );
  const setShowReportProfileModal = useGlobalModalStateStore(
    (state) => state.setShowReportProfileModal
  );
  const setShowDiscardModal = useGlobalModalStateStore(
    (state) => state.setShowDiscardModal
  );

  // Publication store
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );
  const attachments = usePublicationStore((state) => state.attachments);
  const isUploading = usePublicationStore((state) => state.isUploading);
  const videoDurationInSeconds = usePublicationStore(
    (state) => state.videoDurationInSeconds
  );
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail);
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  );
  const quotedPublication = usePublicationStore(
    (state) => state.quotedPublication
  );
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const pollConfig = usePublicationStore((state) => state.pollConfig);

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
      pollConfig.options[0] === ''
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Modal
        icon={<ShieldCheckIcon className="text-brand-500 size-5" />}
        onClose={() =>
          setShowPublicationReportModal(false, reportingPublication)
        }
        show={showPublicationReportModal}
        title="Report Publication"
      >
        <ReportPublication publication={reportingPublication} />
      </Modal>
      <Modal
        icon={<ShieldCheckIcon className="text-brand-500 size-5" />}
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
        show={showReportProfileModal}
        title="Report profile"
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
      <Modal
        onClose={() => setShowProfileSwitchModal(false)}
        show={showProfileSwitchModal}
        size="xs"
        title="Switch Profile"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        icon={<ArrowRightCircleIcon className="text-brand-500 size-5" />}
        onClose={() => setShowAuthModal(false)}
        show={showAuthModal}
        title="Login"
      >
        <Login />
      </Modal>
      <Modal
        onClose={() => setShowWrongNetworkModal(false)}
        show={showWrongNetworkModal}
        title="Wrong Network"
      >
        <WrongNetwork />
      </Modal>
      <Modal
        onClose={() => {
          if (checkIfPublicationNotDrafted()) {
            setShowNewPostModal(false);
          } else {
            setShowDiscardModal(true);
          }
        }}
        show={showNewPostModal}
        size="md"
        title="Create post"
      >
        <NewPublication />
      </Modal>
      <Modal
        icon={<TicketIcon className="text-brand-500 size-5" />}
        onClose={() => setShowInvitesModal(false)}
        show={showInvitesModal}
        title="Invites"
      >
        <Invites />
      </Modal>
    </>
  );
};

export default GlobalModals;
