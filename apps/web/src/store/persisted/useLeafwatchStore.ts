import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  anonymousId: null | string;
  setAnonymousId: (anonymousIdId: string) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      anonymousId: null,
      setAnonymousId: (anonymousId) => set({ anonymousId })
    }),
    { name: Localstorage.LeafwatchStore }
  )
);

export const useLeafwatchStore = createTrackedSelector(store);
