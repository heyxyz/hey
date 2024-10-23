import { Localstorage } from "@hey/data/storage";
import type { List } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  pinnedLists: [] | List[];
  setPinnedLists: (pinnedLists: List[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      pinnedLists: [],
      setPinnedLists: (pinnedLists) => set(() => ({ pinnedLists }))
    }),
    { name: Localstorage.PinnedListStore }
  )
);

export const usePinnedListStore = createTrackedSelector(store);
