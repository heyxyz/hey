import type { Group } from '@hey/types/hey';
import { create } from 'zustand';

interface AppState {
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  verifiedMembers: [],
  setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
  featuredGroups: [],
  setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups }))
  // TODO: add hydrateVerifiedMembers and hydrateFeaturedGroups
}));

export const verifiedMembers = () => useAppStore.getState().verifiedMembers;
export const featuredGroups = () => useAppStore.getState().featuredGroups;
