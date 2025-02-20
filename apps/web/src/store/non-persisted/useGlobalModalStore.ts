import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  setShowAccountSwitchModal: (showAccountSwitchModal: boolean) => void;
  showAccountSwitchModal: boolean;
  showEditStatusModal: boolean;
  setShowEditStatusModal: (showEditStatusModal: boolean) => void;
}

const store = create<State>((set) => ({
  setShowAccountSwitchModal: (showAccountSwitchModal) =>
    set(() => ({ showAccountSwitchModal })),
  showAccountSwitchModal: false,
  showEditStatusModal: false,
  setShowEditStatusModal: (showEditStatusModal) =>
    set(() => ({ showEditStatusModal }))
}));

export const useGlobalModalStore = createTrackedSelector(store);
