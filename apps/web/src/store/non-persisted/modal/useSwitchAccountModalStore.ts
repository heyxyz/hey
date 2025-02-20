import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showSwitchAccountModal: boolean;
  setShowSwitchAccountModal: (showSwitchAccountModal: boolean) => void;
}

const store = create<State>((set) => ({
  showSwitchAccountModal: false,
  setShowSwitchAccountModal: (showSwitchAccountModal) =>
    set(() => ({ showSwitchAccountModal }))
}));

export const useSwitchAccountModalStore = createTrackedSelector(store);
