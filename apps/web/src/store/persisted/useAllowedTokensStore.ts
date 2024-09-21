import { Localstorage } from "@hey/data/storage";
import type { AllowedToken } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  allowedTokens: [] | AllowedToken[];
  setAllowedTokens: (allowedTokens: AllowedToken[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      allowedTokens: [],
      setAllowedTokens: (allowedTokens) => set(() => ({ allowedTokens }))
    }),
    { name: Localstorage.AllowedTokensStore }
  )
);

export const useAllowedTokensStore = createTrackedSelector(store);
