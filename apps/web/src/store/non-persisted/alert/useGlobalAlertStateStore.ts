import type { Account, Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  mutingOrUnmutingAccount: null | Account;
  deletingPost: Post | null;
  setShowMuteOrUnmuteAlert: (
    showMuteOrUnmuteAlert: boolean,
    mutingOrUnmutingAccount: null | Account
  ) => void;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost: Post | null
  ) => void;
  showMuteOrUnmuteAlert: boolean;
  showPostDeleteAlert: boolean;
}

const store = create<State>((set) => ({
  deletingPost: null,
  mutingOrUnmutingAccount: null,
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert })),
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert })),
  showMuteOrUnmuteAlert: false,
  showPostDeleteAlert: false
}));

export const useGlobalAlertStateStore = createTrackedSelector(store);
