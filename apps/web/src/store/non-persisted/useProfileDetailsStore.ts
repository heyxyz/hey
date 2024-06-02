import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  pinnedPublication: null | string;
  setPinnedPublication: (pinnedPublication: null | string) => void;
}

const store = create<State>((set) => ({
  pinnedPublication: null,
  setPinnedPublication: (pinnedPublication) =>
    set(() => ({ pinnedPublication }))
}));

export const useProfileDetailsStore = createTrackedSelector(store);
