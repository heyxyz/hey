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

export const useProfileRestriction = create<ProfileRestrictionState>((set) => ({
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
