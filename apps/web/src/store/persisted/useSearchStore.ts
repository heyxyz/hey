import { Localstorage } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  addProfile: (profile: string) => void;
  profiles: string[];
}

const store = create(
  persist<State>(
    (set) => ({
      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles.slice(-4), profile]
        })),
      profiles: []
    }),
    { name: Localstorage.SearchStore }
  )
);

export const useSearchStore = createTrackedSelector(store);
