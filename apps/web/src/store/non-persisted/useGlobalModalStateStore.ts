import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

type AuthModalType = "login" | "signup";

interface State {
  authModalType: AuthModalType;
  reportingAccount: null | Account;
  reportingPostId: null | string;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowAccountSwitchModal: (showAccountSwitchModal: boolean) => void;
  setShowPostReportModal: (
    showPostReportModal: boolean,
    reportingPostId: null | string
  ) => void;
  setShowReportAccountModal: (
    reportAccountModal: boolean,
    reportingAccount: null | Account
  ) => void;
  showAuthModal: boolean;
  showMobileDrawer: boolean;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showAccountSwitchModal: boolean;
  showPostReportModal: boolean;
  showReportAccountModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
}

const store = create<State>((set) => ({
  authModalType: "login",
  reportingAccount: null,
  reportingPostId: null,
  setShowAuthModal: (showAuthModal, authModalType) => {
    set(() => ({ authModalType, showAuthModal }));
  },
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowAccountSwitchModal: (showAccountSwitchModal) =>
    set(() => ({ showAccountSwitchModal })),
  setShowPostReportModal: (showPostReportModal, reportingPostId) =>
    set(() => ({ reportingPostId, showPostReportModal })),
  setShowReportAccountModal: (showReportAccountModal, reportingAccount) =>
    set(() => ({ reportingAccount, showReportAccountModal })),
  showAuthModal: false,
  showMobileDrawer: false,
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showAccountSwitchModal: false,
  showPostReportModal: false,
  showReportAccountModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal }))
}));

export const useGlobalModalStateStore = createTrackedSelector(store);
