import type { Profile } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface TimelineState {
  seeThroughProfile: null | Profile;
  setSeeThroughProfile: (profile: null | Profile) => void;
}

const store = create<TimelineState>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));

export const useTimelineStore = createTrackedSelector(store);
