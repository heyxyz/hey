import type { Profile } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

export type AuthModalType = 'login' | 'signup';

interface State {
  authModalType: AuthModalType;
  reportingProfile: null | Profile;
  reportingPublicationId: null | string;
  score: null | number;
  scoreViewerProfileId: null | string;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
  setShowDiscardModal: (showDiscardModal: boolean) => void;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  setShowPublicationReportModal: (
    showPublicationReportModal: boolean,
    reportingPublicationId: null | string
  ) => void;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: null | Profile
  ) => void;
  setShowScoreModal: (
    showScoreModal: boolean,
    score: null | number,
    scoreViewerProfileId: null | string
  ) => void;
  showAuthModal: boolean;
  showDiscardModal: boolean;
  showInvitesModal: boolean;
  showMobileDrawer: boolean;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showProfileSwitchModal: boolean;
  showPublicationReportModal: boolean;
  showReportProfileModal: boolean;
  showScoreModal: boolean;
}

const store = create<State>((set) => ({
  authModalType: 'login',
  reportingProfile: null,
  reportingPublicationId: null,
  score: null,
  scoreViewerProfileId: null,
  setShowAuthModal: (showAuthModal, authModalType) => {
    set(() => ({ authModalType, showAuthModal }));
  },
  setShowDiscardModal: (showDiscardModal) => set(() => ({ showDiscardModal })),
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal })),
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  setShowPublicationReportModal: (
    showPublicationReportModal,
    reportingPublicationId
  ) =>
    set(() => ({
      reportingPublicationId,
      showPublicationReportModal
    })),
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ reportingProfile, showReportProfileModal })),
  setShowScoreModal: (showScoreModal, score, scoreViewerProfileId) =>
    set(() => ({ score, scoreViewerProfileId, showScoreModal })),
  showAuthModal: false,
  showDiscardModal: false,
  showInvitesModal: false,
  showMobileDrawer: false,
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showProfileSwitchModal: false,
  showPublicationReportModal: false,
  showReportProfileModal: false,
  showScoreModal: false
}));

export const useGlobalModalStateStore = createTrackedSelector(store);
