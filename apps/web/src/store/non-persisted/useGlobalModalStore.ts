import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowAccountSwitchModal: (showAccountSwitchModal: boolean) => void;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showAccountSwitchModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
}

const store = create<State>((set) => ({
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowAccountSwitchModal: (showAccountSwitchModal) =>
    set(() => ({ showAccountSwitchModal })),
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showAccountSwitchModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal }))
}));

export const useGlobalModalStore = createTrackedSelector(store);
