import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showOptimisticTransactionsModal: boolean;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
}

const store = create<State>((set) => ({
  showOptimisticTransactionsModal: false,
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal }))
}));

export const useOptimisticTransactionsModalStore = createTrackedSelector(store);
