import { HomeFeedType } from "@hey/data/enums";
import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  feedType: HomeFeedType;
  setFeedType: (feedType: HomeFeedType) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      feedType: HomeFeedType.FOLLOWING,
      setFeedType: (feedType) => set(() => ({ feedType }))
    }),
    { name: Localstorage.HomeTabStore }
  )
);

export const useHomeTabStore = createTrackedSelector(store);
