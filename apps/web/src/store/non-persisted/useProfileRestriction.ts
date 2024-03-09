import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface ProfileRestrictionState {
  isFlagged: boolean;
  isSuspended: boolean;
  resetRestriction: () => void;
  setRestriction: ({
    isFlagged,
    isSuspended
  }: {
    isFlagged: boolean;
    isSuspended: boolean;
  }) => void;
}

const store = create<ProfileRestrictionState>((set) => ({
  isFlagged: false,
  isSuspended: false,
  resetRestriction: () =>
    set(() => ({
      isFlagged: false,
      isSuspended: false
    })),
  setRestriction: ({ isFlagged, isSuspended }) =>
    set(() => ({
      isFlagged,
      isSuspended
    }))
}));

export const useProfileRestriction = createTrackedSelector(store);
