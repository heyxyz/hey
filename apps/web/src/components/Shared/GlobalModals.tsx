import type { FC } from 'react';

import ReportPublication from '@components/Shared/Modal/ReportPublication';
import {
  ArrowRightCircleIcon,
  CircleStackIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Modal } from '@hey/ui';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

import Auth from './Auth';
import { useSignupStore } from './Auth/Signup';
import GlobalModalsFromUrl from './GlobalModalsFromUrl';
import OptimisticTransactions from './Modal/OptimisticTransactions';
import ReportProfile from './Modal/ReportProfile';
import SwitchProfiles from './SwitchProfiles';

const GlobalModals: FC = () => {
  const {
    authModalType,
    reportingProfile,
    reportingPublicationId,
    setShowAuthModal,
    setShowOptimisticTransactionsModal,
    setShowProfileSwitchModal,
    setShowPublicationReportModal,
    setShowReportProfileModal,
    showAuthModal,
    showOptimisticTransactionsModal,
    showProfileSwitchModal,
    showPublicationReportModal,
    showReportProfileModal
  } = useGlobalModalStateStore();

  const { screen: signupScreen } = useSignupStore();
  const { address } = useAccount();

  const authModalTitle =
    authModalType === 'signup'
      ? signupScreen === 'choose'
        ? 'Signup'
        : null
      : 'Login';

  return (
    <>
      <GlobalModalsFromUrl />
      <Modal
        icon={<ShieldCheckIcon className="size-5" />}
        onClose={() =>
          setShowPublicationReportModal(false, reportingPublicationId)
        }
        show={showPublicationReportModal}
        title="Report Publication"
      >
        <ReportPublication publicationId={reportingPublicationId} />
      </Modal>
      <Modal
        icon={<ShieldCheckIcon className="size-5" />}
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
        show={showReportProfileModal}
        title="Report profile"
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
      <Modal
        onClose={() => setShowProfileSwitchModal(false)}
        show={showProfileSwitchModal}
        size={!address ? 'sm' : 'xs'}
        title="Switch Profile"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        icon={<ArrowRightCircleIcon className="size-5" />}
        onClose={() => setShowAuthModal(false, authModalType)}
        show={showAuthModal}
        title={authModalTitle}
      >
        <Auth />
      </Modal>
      <Modal
        icon={<CircleStackIcon className="size-5" />}
        onClose={() => setShowOptimisticTransactionsModal(false)}
        show={showOptimisticTransactionsModal}
        title="Optimistic Transactions"
      >
        <OptimisticTransactions />
      </Modal>
    </>
  );
};

export default GlobalModals;
