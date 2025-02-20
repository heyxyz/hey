import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowAccountSwitchModal: (showAccountSwitchModal: boolean) => void;
  showOptimisticTransactionsModal: boolean;
  showAccountSwitchModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
}

const store = create<State>((set) => ({
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowAccountSwitchModal: (showAccountSwitchModal) =>
    set(() => ({ showAccountSwitchModal })),
  showOptimisticTransactionsModal: false,
  showAccountSwitchModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal }))
}));

export const useGlobalModalStore = createTrackedSelector(store);
