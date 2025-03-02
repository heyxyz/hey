import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingAccount?: AccountFragment;
  showBlockOrUnblockAlert: boolean;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingAccount?: AccountFragment
  ) => void;
}

const store = create<State>((set) => ({
  blockingorUnblockingAccount: undefined,
  showBlockOrUnblockAlert: false,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingAccount
  ) => set(() => ({ blockingorUnblockingAccount, showBlockOrUnblockAlert }))
}));

export const useBlockAlertStore = createTrackedSelector(store);
