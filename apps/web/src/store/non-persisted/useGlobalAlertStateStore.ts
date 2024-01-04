import type { AnyPublication, Profile } from '@hey/lens';

import { create } from 'zustand';

interface GlobalAlertState {
  blockingorUnblockingProfile: null | Profile;
  deletingPublication: AnyPublication | null;
  modingPublicationId: null | string;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingProfile: null | Profile
  ) => void;
  setShowModActionAlert: (
    showModActionAlert: boolean,
    modingPublicationId: null | string
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
  modingPublicationId: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingProfile
  ) => set(() => ({ blockingorUnblockingProfile, showBlockOrUnblockAlert })),
  setShowModActionAlert: (showModActionAlert, modingPublicationId) =>
    set(() => ({ modingPublicationId, showModActionAlert })),
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert,
    deletingPublication
  ) => set(() => ({ deletingPublication, showPublicationDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showModActionAlert: false,
  showPublicationDeleteAlert: false
}));
