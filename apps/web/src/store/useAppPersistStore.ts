import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
