import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface Theme {
  overviewFontStyle?: string;
  publicationFontStyle?: string;
}

interface State {
  theme: Theme | null;
  setTheme: (theme: Theme | null) => void;
}

const store = create<State>((set) => ({
  theme: null,
  setTheme: (theme) => set(() => ({ theme }))
}));

export const useProfileThemeStore = createTrackedSelector(store);
