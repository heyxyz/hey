import { create } from "zustand";

type State = {
  feedItemWidth: number;
  setFeedItemWidth: (feedItemWidth: number) => void;
};

export const useDevice = create<State>()((set) => ({
  feedItemWidth: 0,
  setFeedItemWidth: (feedItemWidth) => set({ feedItemWidth })
}));
