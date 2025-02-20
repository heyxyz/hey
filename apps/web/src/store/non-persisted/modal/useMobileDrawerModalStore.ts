import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
}

const store = create<State>((set) => ({
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer }))
}));

export const useMobileDrawerModalStore = createTrackedSelector(store);
