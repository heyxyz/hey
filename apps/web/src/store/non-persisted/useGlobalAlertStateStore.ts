import type { AnyPublication, Profile } from '@hey/lens';

import { create } from 'zustand';

interface GlobalAlertState {
  blockingorUnblockingProfile: null | Profile;
  deletingPublication: AnyPublication | null;
  modingPublication: AnyPublication | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingProfile: null | Profile
  ) => void;
  setShowModActionAlert: (
    showModActionAlert: boolean,
    modingPublication: AnyPublication | null
  ) => void;
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert: boolean,
    deletingPublication: AnyPublication | null
  ) => void;
  showBlockOrUnblockAlert: boolean;
  showModActionAlert: boolean;
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
  setShowModActionAlert: (showModActionAlert, modingPublication) =>
    set(() => ({ modingPublication, showModActionAlert })),
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert,
    deletingPublication
  ) => set(() => ({ deletingPublication, showPublicationDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showModActionAlert: false,
  showPublicationDeleteAlert: false
}));
