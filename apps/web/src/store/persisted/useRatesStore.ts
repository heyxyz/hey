import { Localstorage } from "@hey/data/storage";
import type { FiatRate } from "@hey/types/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  fiatRates: [] | FiatRate[];
  setFiatRates: (fiatRates: FiatRate[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      fiatRates: [],
      setFiatRates: (fiatRates) => set(() => ({ fiatRates }))
    }),
    { name: Localstorage.RateStore }
  )
);

export const useRatesStore = createTrackedSelector(store);
