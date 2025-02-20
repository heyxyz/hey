import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showFundModal: boolean;
  setShowFundModal: (showFundModal: boolean) => void;
}

const store = create<State>((set) => ({
  showFundModal: false,
  setShowFundModal: (showFundModal) => set(() => ({ showFundModal }))
}));

export const useFundModalStore = createTrackedSelector(store);
