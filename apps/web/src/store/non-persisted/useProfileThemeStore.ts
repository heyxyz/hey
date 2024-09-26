import type { ProfileTheme } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  theme: ProfileTheme | null;
  setTheme: (theme: ProfileTheme | null) => void;
}

const store = create<State>((set) => ({
  theme: null,
  setTheme: (theme) => set(() => ({ theme }))
}));

export const useProfileThemeStore = createTrackedSelector(store);
