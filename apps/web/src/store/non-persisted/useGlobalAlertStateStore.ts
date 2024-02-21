import type { AnyPublication, MirrorablePublication, Profile } from '@hey/lens';

import { create } from 'zustand';

interface GlobalAlertState {
  blockingorUnblockingProfile: null | Profile;
  deletingPublication: AnyPublication | null;
  modingPublication: MirrorablePublication | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingProfile: null | Profile
  ) => void;
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert: boolean,
    modingPublication: MirrorablePublication | null
  ) => void;
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert: boolean,
    deletingPublication: AnyPublication | null
  ) => void;
  showBlockOrUnblockAlert: boolean;
  showGardenerActionsAlert: boolean;
  showPublicationDeleteAlert: boolean;
}

export const useGlobalAlertStateStore = create<GlobalAlertState>((set) => ({
  blockingorUnblockingProfile: null,
  deletingPublication: null,
  forceDeletePublication: false,
  modingPublication: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingProfile
  ) => set(() => ({ blockingorUnblockingProfile, showBlockOrUnblockAlert })),
  setShowGardenerActionsAlert: (showGardenerActionsAlert, modingPublication) =>
    set(() => ({ modingPublication, showGardenerActionsAlert })),
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert,
    deletingPublication
  ) => set(() => ({ deletingPublication, showPublicationDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showGardenerActionsAlert: false,
  showPublicationDeleteAlert: false
}));
