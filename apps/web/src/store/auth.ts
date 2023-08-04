import { Localstorage } from '@lenster/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthPerisistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
}

export const useAuthPersistStore = create(
  persist<AuthPerisistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId }))
    }),
    { name: Localstorage.AuthStore }
  )
);
