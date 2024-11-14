import NewPublication from "@components/Composer/NewPublication";
import ReportPost from "@components/Shared/Modal/ReportPost";
import { Modal } from "@hey/ui";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccount } from "wagmi";
import Auth from "./Auth";
import { useSignupStore } from "./Auth/Signup";
import GlobalModalsFromUrl from "./GlobalModalsFromUrl";
import AddToList from "./Modal/AddToList";
import OptimisticTransactions from "./Modal/OptimisticTransactions";
import ProfileStatus from "./Modal/ProfileStatus";
import ReportProfile from "./Modal/ReportProfile";
import SwitchProfiles from "./SwitchProfiles";

const GlobalModals: FC = () => {
  const {
    authModalType,
    reportingProfile,
    reportingPostId,
    setShowAuthModal,
    setShowNewPostModal,
    setShowOptimisticTransactionsModal,
    setShowProfileSwitchModal,
    setShowPostReportModal,
    setShowReportProfileModal,
    showAuthModal,
    showNewPostModal,
    showOptimisticTransactionsModal,
    showProfileSwitchModal,
    showPostReportModal,
    showReportProfileModal,
    showEditStatusModal,
    setShowEditStatusModal,
    showAddToListModal,
    setShowAddToListModal
  } = useGlobalModalStateStore();

  const { screen: signupScreen } = useSignupStore();
  const { address } = useAccount();

  const authModalTitle =
    authModalType === "signup"
      ? signupScreen === "choose"
        ? "Signup"
        : null
      : "Login";

  return (
    <>
      <GlobalModalsFromUrl />
      <Modal
        onClose={() => setShowPostReportModal(false, reportingPostId)}
        show={showPostReportModal}
        title="Report Post"
      >
        <ReportPost postId={reportingPostId} />
      </Modal>
      <Modal
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
        show={showReportProfileModal}
        title="Report profile"
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
      <Modal
        onClose={() => setShowProfileSwitchModal(false)}
        show={showProfileSwitchModal}
        size={address ? "xs" : "sm"}
        title="Switch Profile"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        onClose={() => setShowAuthModal(false, authModalType)}
        show={showAuthModal}
        title={authModalTitle}
      >
        <Auth />
      </Modal>
      <Modal
        onClose={() => setShowNewPostModal(false)}
        show={showNewPostModal}
        size="md"
        title="Create post"
      >
        <NewPublication className="!rounded-b-xl !rounded-t-none border-none" />
      </Modal>
      <Modal
        onClose={() => setShowOptimisticTransactionsModal(false)}
        show={showOptimisticTransactionsModal}
        title="Optimistic Transactions"
      >
        <OptimisticTransactions />
      </Modal>
      <Modal
        onClose={() => setShowEditStatusModal(false)}
        show={showEditStatusModal}
        title="Edit Status"
      >
        <ProfileStatus />
      </Modal>
      <Modal
        onClose={() => setShowAddToListModal(false, null)}
        show={showAddToListModal}
        title="Add to list"
      >
        <AddToList />
      </Modal>
    </>
  );
};

export default GlobalModals;
