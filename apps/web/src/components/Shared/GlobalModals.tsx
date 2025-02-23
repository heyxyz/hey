import NewPublication from "@components/Composer/NewPublication";
import ReportPost from "@components/Shared/Modal/ReportPost";
import { Modal } from "@hey/ui";
import type { FC } from "react";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useFundModalStore } from "src/store/non-persisted/modal/useFundModalStore";
import { useNewPostModalStore } from "src/store/non-persisted/modal/useNewPostModalStore";
import { useReportAccountModalStore } from "src/store/non-persisted/modal/useReportAccountModalStore";
import { useReportPostModalStore } from "src/store/non-persisted/modal/useReportPostModalStore";
import { useSuperFollowModalStore } from "src/store/non-persisted/modal/useSuperFollowModalStore";
import { useSuperJoinModalStore } from "src/store/non-persisted/modal/useSuperJoinModalStore";
import { useSwitchAccountModalStore } from "src/store/non-persisted/modal/useSwitchAccountModalStore";
import SuperFollow from "./Account/SuperFollow";
import Auth from "./Auth";
import { useSignupStore } from "./Auth/Signup";
import FundAccount from "./Fund/FundAccount";
import GlobalModalsFromUrl from "./GlobalModalsFromUrl";
import SuperJoin from "./Group/SuperJoin";
import ReportAccount from "./Modal/ReportAccount";
import SwitchAccounts from "./SwitchAccounts";

const GlobalModals: FC = () => {
  const { setShowSwitchAccountModal, showSwitchAccountModal } =
    useSwitchAccountModalStore();
  const { showNewPostModal, setShowNewPostModal } = useNewPostModalStore();
  const { authModalType, showAuthModal, setShowAuthModal } =
    useAuthModalStore();
  const {
    reportingAccount,
    showReportAccountModal,
    setShowReportAccountModal
  } = useReportAccountModalStore();
  const { reportingPostId, showReportPostModal, setShowReportPostModal } =
    useReportPostModalStore();
  const { showFundModal, setShowFundModal } = useFundModalStore();
  const { showSuperJoinModal, setShowSuperJoinModal, superJoiningGroup } =
    useSuperJoinModalStore();
  const {
    showSuperFollowModal,
    setShowSuperFollowModal,
    superFollowingAccount
  } = useSuperFollowModalStore();

  const { screen: signupScreen } = useSignupStore();

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
        onClose={() => setShowReportPostModal(false, reportingPostId)}
        show={showReportPostModal}
        title="Report Post"
      >
        <ReportPost postId={reportingPostId} />
      </Modal>
      <Modal
        onClose={() => setShowReportAccountModal(false, reportingAccount)}
        show={showReportAccountModal}
        title="Report account"
      >
        <ReportAccount account={reportingAccount} />
      </Modal>
      <Modal
        onClose={() => setShowSwitchAccountModal(false)}
        show={showSwitchAccountModal}
        size="xs"
        title="Switch Account"
      >
        <SwitchAccounts />
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
        onClose={() => setShowFundModal(false)}
        show={showFundModal}
        title="Fund account"
      >
        <FundAccount />
      </Modal>
      <Modal
        onClose={() => setShowSuperJoinModal(false, superJoiningGroup)}
        show={showSuperJoinModal}
        title="Super Join"
      >
        <SuperJoin />
      </Modal>
      <Modal
        onClose={() => setShowSuperFollowModal(false, superFollowingAccount)}
        show={showSuperFollowModal}
        title="Super Follow"
      >
        <SuperFollow />
      </Modal>
    </>
  );
};

export default GlobalModals;
