import type { Account, AnyPost } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingorUnblockingProfile: null | Account;
  deletingPost: AnyPost | null;
  modingPost: MirrorablePost | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingProfile: null | Account
  ) => void;
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert: boolean,
    modingPost: MirrorablePublication | null
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
  blockingorUnblockingProfile: null,
  deletingPost: null,
  modingPost: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingProfile
  ) => set(() => ({ blockingorUnblockingProfile, showBlockOrUnblockAlert })),
  setShowGardenerActionsAlert: (showGardenerActionsAlert, modingPost) =>
    set(() => ({ modingPost, showGardenerActionsAlert })),
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showGardenerActionsAlert: false,
  showPostDeleteAlert: false
}));

export const useGlobalAlertStateStore = createTrackedSelector(store);
