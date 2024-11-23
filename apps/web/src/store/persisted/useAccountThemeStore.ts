import { Localstorage } from "@hey/data/storage";
import type { AccountTheme } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  theme: AccountTheme | null;
  setTheme: (theme: AccountTheme | null) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      theme: null,
      setTheme: (theme) => set(() => ({ theme }))
    }),
    { name: Localstorage.AccountThemeStore }
  )
);

export const useAccountThemeStore = createTrackedSelector(store);
