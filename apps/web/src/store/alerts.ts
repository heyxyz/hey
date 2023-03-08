import type { Publication } from 'lens';
import { create } from 'zustand';

interface GlobalAlertState {
  showPublicationDeleteAlert: boolean;
  deletingPublication: Publication | null;
  setShowPublicationDeleteAlert: (
    showPublicationDeleteAlert: boolean,
    deletingPublication: Publication | null
  ) => void;
}

export const useGlobalAlertStateStore = create<GlobalAlertState>((set) => ({
  showPublicationDeleteAlert: false,
  deletingPublication: null,
  forceDeletePublication: false,
  setShowPublicationDeleteAlert: (showPublicationDeleteAlert, deletingPublication) =>
    set(() => ({ showPublicationDeleteAlert, deletingPublication }))
}));
