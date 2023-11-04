import { create } from 'zustand';

interface LeafwatchState {
  viewedPublication: string | null;
  setViewedPublication: (viewedPublication: string | null) => void;
}

export const useLeafwatchStore = create<LeafwatchState>((set) => ({
  viewedPublication: null,
  setViewedPublication: (viewedPublication) =>
    set(() => ({ viewedPublication }))
}));
