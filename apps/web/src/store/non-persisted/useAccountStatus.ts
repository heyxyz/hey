import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  isSuspended: boolean;
  resetStatus: () => void;
  setStatus: ({
    isSuspended
  }: {
    isSuspended: boolean;
  }) => void;
}

const store = create<State>((set) => ({
  isSuspended: false,
  resetStatus: () =>
    set(() => ({
      isSuspended: false
    })),
  setStatus: ({ isSuspended }) =>
    set(() => ({
      isSuspended
    }))
}));

export const useAccountStatus = createTrackedSelector(store);
