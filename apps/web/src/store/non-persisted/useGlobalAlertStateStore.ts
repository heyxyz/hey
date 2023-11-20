import type { AnyPublication, Profile } from '@hey/lens';
import { create } from 'zustand';

interface GlobalAlertState {
  showPublicationDeleteAlert: boolean;
  deletingPublication: AnyPublication | null;
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert: boolean,
    deletingPublication: AnyPublication | null
  ) => void;
  showModActionAlert: boolean;
  modingPublication: AnyPublication | null;
  setShowModActionAlert: (
    showModActionAlert: boolean,
    modingPublication: AnyPublication | null
  ) => void;
  showBlockOrUnblockAlert: boolean;
  blockingorUnblockingProfile: Profile | null;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingorUnblockingProfile: Profile | null
  ) => void;
}

export const useGlobalAlertStateStore = create<GlobalAlertState>((set) => ({
  showPublicationDeleteAlert: false,
  deletingPublication: null,
  forceDeletePublication: false,
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert,
    deletingPublication
  ) => set(() => ({ showPublicationDeleteAlert, deletingPublication })),
  showModActionAlert: false,
  modingPublication: null,
  setShowModActionAlert: (showModActionAlert, modingPublication) =>
    set(() => ({ showModActionAlert, modingPublication })),
  showBlockOrUnblockAlert: false,
  blockingorUnblockingProfile: null,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingorUnblockingProfile
  ) => set(() => ({ showBlockOrUnblockAlert, blockingorUnblockingProfile }))
}));
