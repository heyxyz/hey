import type { Account, Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  mutingOrUnmutingAccount: null | Account;
  deletingPost: Post | null;
  modingPost: Post | null;
  setShowMuteOrUnmuteAlert: (
    showMuteOrUnmuteAlert: boolean,
    mutingOrUnmutingAccount: null | Account
  ) => void;
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert: boolean,
    modingPost: Post | null
  ) => void;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost: Post | null
  ) => void;
  showMuteOrUnmuteAlert: boolean;
  showGardenerActionsAlert: boolean;
  showPostDeleteAlert: boolean;
}

const store = create<State>((set) => ({
  deletingPost: null,
  mutingOrUnmutingAccount: null,
  modingPost: null,
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert })),
  setShowGardenerActionsAlert: (showGardenerActionsAlert, modingPost) =>
    set(() => ({ modingPost, showGardenerActionsAlert })),
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert })),
  showGardenerActionsAlert: false,
  showMuteOrUnmuteAlert: false,
  showPostDeleteAlert: false
}));

export const useGlobalAlertStateStore = createTrackedSelector(store);
