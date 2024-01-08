import type { AnyPublication, Profile } from '@hey/lens';

import { create } from 'zustand';

interface GlobalState {
  setShowTrustedProfileReporting: (
    showTrustedProfileReporting: boolean,
    reportingProfile: null | Profile
  ) => void;
  showTrustedProfileReporting: boolean;
  trustedProfileReportingPublication: AnyPublication | null;
}

export const useGlobalStateStore = create<GlobalState>((set) => ({
  setShowTrustedProfileReporting: (
    showTrustedProfileReporting,
    reportingProfile
  ) => set(() => ({ reportingProfile, showTrustedProfileReporting })),
  showTrustedProfileReporting: false,
  trustedProfileReportingPublication: null
}));
