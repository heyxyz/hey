import { Localstorage } from "@hey/data/storage";
import type { Profile } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    { name: Localstorage.ProfileStore }
  )
);

export const useProfileStore = createTrackedSelector(store);
