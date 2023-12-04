import type { Profile } from '@hey/lens';

import { create } from 'zustand';

interface TimelineState {
  seeThroughProfile: null | Profile;
  setSeeThroughProfile: (profile: null | Profile) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));
