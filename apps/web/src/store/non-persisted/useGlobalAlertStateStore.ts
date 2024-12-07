import type { Account, AnyPost } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingAccount: null | Account;
  deletingPost: AnyPost | null;
  modingPost: AnyPost | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingAccount: null | Account
  ) => void;
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert: boolean,
    modingPost: AnyPost | null
  ) => void;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost: AnyPost | null
  ) => void;
  showBlockOrUnblockAlert: boolean;
  showGardenerActionsAlert: boolean;
  showPostDeleteAlert: boolean;
}

const store = create<State>((set) => ({
  blockingorUnblockingAccount: null,
  deletingPost: null,
  modingPost: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingAccount
  ) => set(() => ({ blockingorUnblockingAccount, showBlockOrUnblockAlert })),
  setShowGardenerActionsAlert: (showGardenerActionsAlert, modingPost) =>
    set(() => ({ modingPost, showGardenerActionsAlert })),
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showGardenerActionsAlert: false,
  showPostDeleteAlert: false
}));

export const useGlobalAlertStateStore = createTrackedSelector(store);
