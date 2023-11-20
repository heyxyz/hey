import { IndexDB } from '@hey/data/storage';
import type { Profile } from '@hey/lens';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from './lib/createIdbStorage';

interface ProfilePerisistState {
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
}

export const useProfilePersistStore = create(
  persist<ProfilePerisistState>(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile }))
    }),
    {
      name: IndexDB.ProfileStore,
      storage: createIdbStorage()
    }
  )
);

export default useProfilePersistStore;
