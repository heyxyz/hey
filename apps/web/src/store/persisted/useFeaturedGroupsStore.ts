import { IndexDB } from '@hey/data/storage';
import type { Group } from '@hey/types/hey';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeaturedGroupsState {
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
  hydrateFeaturedGroups: () => { featuredGroups: Group[] };
}

export const useFeaturedGroupsStore = create(
  persist<FeaturedGroupsState>(
    (set, get) => ({
      featuredGroups: [],
      setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups })),
      hydrateFeaturedGroups: () => {
        return {
          featuredGroups: get().featuredGroups
        };
      }
    }),
    {
      name: IndexDB.FeaturedGroupsStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateFeaturedGroups = () =>
  useFeaturedGroupsStore.getState().hydrateFeaturedGroups();
