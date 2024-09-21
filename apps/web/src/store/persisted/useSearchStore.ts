import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  addProfile: (profile: string) => void;
  clearProfile: (profile: string) => void;
  clearProfiles: () => void;
  profiles: string[];
}

const store = create(
  persist<State>(
    (set) => ({
      addProfile: (profile) =>
        set((state) => {
          // Remove the profile if it already exists
          const filteredProfiles = state.profiles.filter((p) => p !== profile);
          // Add the new profile to the start of the array and ensure the total is at most 5
          return { profiles: [profile, ...filteredProfiles].slice(0, 5) };
        }),
      clearProfile: (profile) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p !== profile)
        })),
      clearProfiles: () => set({ profiles: [] }),
      profiles: []
    }),
    { name: Localstorage.SearchStore }
  )
);

export const useSearchStore = createTrackedSelector(store);
