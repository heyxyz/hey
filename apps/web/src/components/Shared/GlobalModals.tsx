import type { FC } from 'react';

import NewPublication from '@components/Composer/NewPublication';
import ReportPublication from '@components/Shared/Modal/ReportPublication';
import {
  ArrowRightCircleIcon,
  ShieldCheckIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { Modal } from '@hey/ui';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAudioStore } from 'src/store/non-persisted/publication/usePublicationAudioStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { usePublicationVideoStore } from 'src/store/non-persisted/publication/usePublicationVideoStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useAccount } from 'wagmi';

import Auth from './Auth';
import { useSignupStore } from './Auth/Signup';
import Invites from './Modal/Invites';
import ReportProfile from './Modal/ReportProfile';
import SwitchProfiles from './SwitchProfiles';

const GlobalModals: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  // Report modal state
  const showPublicationReportModal = useGlobalModalStateStore(
    (state) => state.showPublicationReportModal
  );
  const reportingPublicationId = useGlobalModalStateStore(
    (state) => state.reportingPublicationId
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
  const authModalType = useGlobalModalStateStore(
    (state) => state.authModalType
  );
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
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
  const attachments = usePublicationAttachmentStore(
    (state) => state.attachments
  );
  const isUploading = usePublicationAttachmentStore(
    (state) => state.isUploading
  );
  const videoDurationInSeconds = usePublicationVideoStore(
    (state) => state.videoDurationInSeconds
  );
  const videoThumbnail = usePublicationVideoStore(
    (state) => state.videoThumbnail
  );
  const audioPublication = usePublicationAudioStore(
    (state) => state.audioPublication
  );
  const quotedPublication = usePublicationStore(
    (state) => state.quotedPublication
  );
  const showPollEditor = usePublicationPollStore(
    (state) => state.showPollEditor
  );
  const pollConfig = usePublicationPollStore((state) => state.pollConfig);
  const signupScreen = useSignupStore((state) => state.screen);
  const { address } = useAccount();

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
  const showSignupModalTitle = signupScreen === 'choose';
  const authModalTitle =
    authModalType === 'signup'
      ? showSignupModalTitle
        ? 'Signup'
        : null
      : 'Login';

  return (
    <>
      <Modal
        icon={<ShieldCheckIcon className="text-brand-500 size-5" />}
        onClose={() =>
          setShowPublicationReportModal(false, reportingPublicationId)
        }
        show={showPublicationReportModal}
        title="Report Publication"
      >
        <ReportPublication publicationId={reportingPublicationId} />
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
        size={currentProfile?.ownedBy.address !== address ? 'sm' : 'xs'}
        title="Switch Profile"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        icon={<ArrowRightCircleIcon className="text-brand-500 size-5" />}
        onClose={() => setShowAuthModal(false, authModalType)}
        show={showAuthModal}
        title={authModalTitle}
      >
        <Auth />
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
