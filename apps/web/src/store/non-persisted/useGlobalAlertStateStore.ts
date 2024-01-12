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
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert: boolean,
    modingPublicationId: null | string
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
  modingPublicationId: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingProfile
  ) => set(() => ({ blockingorUnblockingProfile, showBlockOrUnblockAlert })),
  setShowGardenerActionsAlert: (
    showGardenerActionsAlert,
    modingPublicationId
  ) => set(() => ({ modingPublicationId, showGardenerActionsAlert })),
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert,
    deletingPublication
  ) => set(() => ({ deletingPublication, showPublicationDeleteAlert })),
  showBlockOrUnblockAlert: false,
  showGardenerActionsAlert: false,
  showPublicationDeleteAlert: false
}));
