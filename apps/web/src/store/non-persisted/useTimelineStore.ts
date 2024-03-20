import type { Profile } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  seeThroughProfile: null | Profile;
  setSeeThroughProfile: (profile: null | Profile) => void;
}

const store = create<State>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));

export const useTimelineStore = createTrackedSelector(store);
