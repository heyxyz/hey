import type { Publication } from '@lenster/lens';
import { create } from 'zustand';

interface GlobalAlertState {
  showPublicationDeleteAlert: boolean;
  deletingPublication: Publication | null;
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert: boolean,
    deletingPublication: Publication | null
  ) => void;
  showModActionAlert: boolean;
  modingPublication: Publication | null;
  setShowModActionAlert: (
    showModActionAlert: boolean,
    modingPublication: Publication | null
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
    set(() => ({ showModActionAlert, modingPublication }))
}));
