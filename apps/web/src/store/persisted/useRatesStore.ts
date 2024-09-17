import type { FiatRate } from "@hey/types/lens";

import { IndexDB } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import createIdbStorage from "../helpers/createIdbStorage";

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
    { name: IndexDB.RateStore, storage: createIdbStorage() }
  )
);

export const useRatesStore = createTrackedSelector(store);
