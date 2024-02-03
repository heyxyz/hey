import type { Profile } from '@hey/lens';

import { create } from 'zustand';

interface TimelineState {
  fallbackToCuratedFeed: boolean;
  seeThroughProfile: null | Profile;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
  setSeeThroughProfile: (profile: null | Profile) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  fallbackToCuratedFeed: false,
  seeThroughProfile: null,
  setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
    set(() => ({ fallbackToCuratedFeed })),
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));
