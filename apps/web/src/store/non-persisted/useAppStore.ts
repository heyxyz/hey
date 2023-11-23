import type { Group } from '@hey/types/hey';
import { create } from 'zustand';

interface AppState {
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  featuredGroups: [],
  setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups }))
}));

export const featuredGroups = () => useAppStore.getState().featuredGroups;
