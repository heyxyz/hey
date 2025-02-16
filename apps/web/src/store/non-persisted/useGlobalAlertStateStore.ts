import type { Account, Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingAccount: null | Account;
  banningOrUnbanningAccount: null | Account;
  banningGroupAddress: null | string;
  banning: boolean;
  mutingOrUnmutingAccount: null | Account;
  deletingPost: Post | null;
  modingPost: Post | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingAccount: null | Account
  ) => void;
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert: boolean,
    banning: boolean,
    banningOrUnbanningAccount: null | Account,
    banningGroupAddress: null | string
  ) => void;
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
  showBlockOrUnblockAlert: boolean;
  showBanOrUnbanAlert: boolean;
  showMuteOrUnmuteAlert: boolean;
  showGardenerActionsAlert: boolean;
  showPostDeleteAlert: boolean;
}

const store = create<State>((set) => ({
  blockingorUnblockingAccount: null,
  banningOrUnbanningAccount: null,
  banningGroupAddress: null,
  banning: false,
  deletingPost: null,
  mutingOrUnmutingAccount: null,
  modingPost: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingAccount
  ) => set(() => ({ blockingorUnblockingAccount, showBlockOrUnblockAlert })),
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert,
    banning,
    banningOrUnbanningAccount,
    banningGroupAddress
  ) =>
    set(() => ({
      banning,
      banningOrUnbanningAccount,
      banningGroupAddress,
      showBanOrUnbanAlert
    })),
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert })),
  setShowGardenerActionsAlert: (showGardenerActionsAlert, modingPost) =>
    set(() => ({ modingPost, showGardenerActionsAlert })),
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showBanOrUnbanAlert: false,
  showGardenerActionsAlert: false,
  showMuteOrUnmuteAlert: false,
  showPostDeleteAlert: false
}));

export const useGlobalAlertStateStore = createTrackedSelector(store);
