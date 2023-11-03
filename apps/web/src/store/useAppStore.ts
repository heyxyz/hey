import type { Profile } from '@hey/lens';
import type { Group } from '@hey/types/hey';
import { create } from 'zustand';

interface AppState {
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  verifiedMembers: [],
  setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
  featuredGroups: [],
  setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups }))
}));

export const verifiedMembers = () => useAppStore.getState().verifiedMembers;
export const featuredGroups = () => useAppStore.getState().featuredGroups;
