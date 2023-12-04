import type { Profile } from '@hey/lens';

import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface ProfileState {
  currentProfile: null | Profile;
  setCurrentProfile: (currentProfile: null | Profile) => void;
}

export const useProfileStore = create(
  persist<ProfileState>(
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

export default useProfileStore;
