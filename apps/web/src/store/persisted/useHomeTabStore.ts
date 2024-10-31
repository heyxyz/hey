import { HomeFeedType } from "@hey/data/enums";
import { Localstorage } from "@hey/data/storage";
import type { List } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  feedType: HomeFeedType;
  setFeedType: (feedType: HomeFeedType) => void;
  pinnedList: List | null;
  setPinnedList: (pinnedList: List | null) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      feedType: HomeFeedType.FOLLOWING,
      setFeedType: (feedType) => set(() => ({ feedType })),
      pinnedList: null,
      setPinnedList: (pinnedList) => set(() => ({ pinnedList }))
    }),
    { name: Localstorage.HomeTabStore }
  )
);

export const useHomeTabStore = createTrackedSelector(store);
