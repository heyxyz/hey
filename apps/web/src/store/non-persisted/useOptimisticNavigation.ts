import type { AnyPublication } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  preLoadedPublications: AnyPublication[];
  setPreLoadedPublications: (publications: AnyPublication[]) => void;
}

export const store = create<State>((set) => ({
  preLoadedPublications: [],
  setPreLoadedPublications: (publications) =>
    set(() => ({
      preLoadedPublications: publications
    }))
}));

export const useOptimisticNavigation = createTrackedSelector(store);
