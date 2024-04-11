import type { AnyPublication, MirrorablePublication, Profile } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
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

const store = create<State>((set) => ({
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

export const useGlobalAlertStateStore = createTrackedSelector(store);
