import { Localstorage } from "@hey/data/storage";
import type { ProfileTheme } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  theme: ProfileTheme | null;
  setTheme: (theme: ProfileTheme | null) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      theme: null,
      setTheme: (theme) => set(() => ({ theme }))
    }),
    { name: Localstorage.ProfileThemeStore }
  )
);

export const useProfileThemeStore = createTrackedSelector(store);
