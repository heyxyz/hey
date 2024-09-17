import type { Profile } from "@hey/lens";

import { IndexDB } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import createIdbStorage from "../helpers/createIdbStorage";

interface State {
  currentProfile: null | Profile;
  fallbackToCuratedFeed: boolean;
  setCurrentProfile: (currentProfile: null | Profile) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentProfile: null,
      fallbackToCuratedFeed: false,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed }))
    }),
    { name: IndexDB.ProfileStore, storage: createIdbStorage() }
  )
);

export const useProfileStore = createTrackedSelector(store);
