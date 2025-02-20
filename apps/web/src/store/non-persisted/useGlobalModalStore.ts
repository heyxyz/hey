import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

type AuthModalType = "login" | "signup";

interface State {
  authModalType: AuthModalType;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowAccountSwitchModal: (showAccountSwitchModal: boolean) => void;
  showAuthModal: boolean;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showAccountSwitchModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
}

const store = create<State>((set) => ({
  authModalType: "login",
  setShowAuthModal: (showAuthModal, authModalType) => {
    set(() => ({ authModalType, showAuthModal }));
  },
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowAccountSwitchModal: (showAccountSwitchModal) =>
    set(() => ({ showAccountSwitchModal })),
  showAuthModal: false,
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showAccountSwitchModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal }))
}));

export const useGlobalModalStore = createTrackedSelector(store);
