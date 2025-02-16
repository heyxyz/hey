import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingAccount: null | Account;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingAccount: null | Account
  ) => void;
  showBlockOrUnblockAlert: boolean;
}

const store = create<State>((set) => ({
  blockingorUnblockingAccount: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingAccount
  ) => set(() => ({ blockingorUnblockingAccount, showBlockOrUnblockAlert })),
  showBlockOrUnblockAlert: false
}));

export const useBlockAlertStateStore = createTrackedSelector(store);
