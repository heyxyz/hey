import type { Profile } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

type AuthModalType = "login" | "signup";

interface State {
  authModalType: AuthModalType;
  reportingProfile: null | Profile;
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
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  setShowPostReportModal: (
    showPostReportModal: boolean,
    reportingPostId: null | string
  ) => void;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: null | Profile
  ) => void;
  showAuthModal: boolean;
  showMobileDrawer: boolean;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showProfileSwitchModal: boolean;
  showPostReportModal: boolean;
  showReportProfileModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
  showAddToListModal: boolean;
  profileToAddToList: null | Profile;
  setShowAddToListModal: (
    showAddToListModal: boolean,
    profileToAddToList: null | Profile
  ) => void;
}

const store = create<State>((set) => ({
  authModalType: "login",
  reportingProfile: null,
  reportingPostId: null,
  setShowAuthModal: (showAuthModal, authModalType) => {
    set(() => ({ authModalType, showAuthModal }));
  },
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  setShowPostReportModal: (showPostReportModal, reportingPostId) =>
    set(() => ({ reportingPostId, showPostReportModal })),
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ reportingProfile, showReportProfileModal })),
  showAuthModal: false,
  showMobileDrawer: false,
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showProfileSwitchModal: false,
  showPostReportModal: false,
  showReportProfileModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal })),
  showAddToListModal: false,
  profileToAddToList: null,
  setShowAddToListModal: (showAddToListModal, profileToAddToList) =>
    set(() => ({ profileToAddToList, showAddToListModal }))
}));

export const useGlobalModalStateStore = createTrackedSelector(store);
