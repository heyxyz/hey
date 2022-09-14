/* eslint-disable no-unused-vars */
import { LensterPublication } from '@generated/lenstertypes';
import create from 'zustand';

interface GlobalModalState {
  showReportModal: boolean;
  reportPublication: LensterPublication | null;
  setShowReportModal: (showReportModal: boolean, reportPublication: LensterPublication | null) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showReportModal: false,
  reportPublication: null,
  setShowReportModal: (showReportModal, reportPublication) =>
    set(() => ({ showReportModal, reportPublication }))
}));
