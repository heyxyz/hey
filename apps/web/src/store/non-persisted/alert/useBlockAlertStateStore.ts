import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingAccount: null | Account;
  showBlockOrUnblockAlert: boolean;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingAccount: null | Account
  ) => void;
}

const store = create<State>((set) => ({
  blockingorUnblockingAccount: null,
  showBlockOrUnblockAlert: false,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingAccount
  ) => set(() => ({ blockingorUnblockingAccount, showBlockOrUnblockAlert }))
}));

export const useBlockAlertStateStore = createTrackedSelector(store);
