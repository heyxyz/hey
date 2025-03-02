import type { AnyPostFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  preLoadedPosts: AnyPostFragment[];
  setPreLoadedPosts: (posts: AnyPostFragment[]) => void;
}

export const store = create<State>((set) => ({
  preLoadedPosts: [],
  setPreLoadedPosts: (posts) => set(() => ({ preLoadedPosts: posts }))
}));

export const useOptimisticNavigation = createTrackedSelector(store);
