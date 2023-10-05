import { Localstorage } from '@hey/data/storage';
import type { Profile } from '@hey/lens';
import type { Group } from '@hey/types/hey';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  verifiedMembers: [],
  setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
  featuredGroups: [],
  setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups }))
}));

interface AppPerisistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
}

export const useAppPersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId }))
    }),
    { name: Localstorage.AppStore }
  )
);

export const verifiedMembers = () => useAppStore.getState().verifiedMembers;
export const featuredGroups = () => useAppStore.getState().featuredGroups;
