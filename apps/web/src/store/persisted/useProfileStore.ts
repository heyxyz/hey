import type { Profile } from '@hey/lens';

import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface ProfileState {
  currentProfile: null | Profile;
  fallbackToCuratedFeed: boolean;
  setCurrentProfile: (currentProfile: null | Profile) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
}

export const useProfileStore = create(
  persist<ProfileState>(
    (set) => ({
      currentProfile: null,
      fallbackToCuratedFeed: false,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed }))
    }),
    {
      name: IndexDB.ProfileStore,
      storage: createIdbStorage()
    }
  )
);

export default useProfileStore;
