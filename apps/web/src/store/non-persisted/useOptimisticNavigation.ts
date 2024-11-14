import type { AnyPublication } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  preLoadedPosts: AnyPublication[];
  setPreLoadedPosts: (posts: AnyPublication[]) => void;
}

export const store = create<State>((set) => ({
  preLoadedPosts: [],
  setPreLoadedPosts: (posts) => set(() => ({ preLoadedPosts: posts }))
}));

export const useOptimisticNavigation = createTrackedSelector(store);
