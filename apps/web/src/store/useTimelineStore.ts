import type { Profile } from '@hey/lens';
import { create } from 'zustand';

interface TimelineState {
  seeThroughProfile: Profile | null;
  setSeeThroughProfile: (profile: Profile | null) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));
