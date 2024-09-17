import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  anonymousId: null | string;
  hydrateLeafwatchAnonymousId: () => null | string;
  setAnonymousId: (anonymousIdId: string) => void;
}

const store = create(
  persist<State>(
    (set, get) => ({
      anonymousId: null,
      hydrateLeafwatchAnonymousId: () => {
        return get().anonymousId;
      },
      setAnonymousId: (anonymousId) => set({ anonymousId })
    }),
    { name: Localstorage.LeafwatchStore }
  )
);

export const hydrateLeafwatchAnonymousId = () =>
  store.getState().hydrateLeafwatchAnonymousId();
export const useLeafwatchStore = createTrackedSelector(store);
