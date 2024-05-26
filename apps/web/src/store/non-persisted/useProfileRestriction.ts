import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  isCommentSuspended: boolean;
  isSuspended: boolean;
  resetRestriction: () => void;
  setRestriction: ({
    isCommentSuspended,
    isSuspended
  }: {
    isCommentSuspended: boolean;
    isSuspended: boolean;
  }) => void;
}

const store = create<State>((set) => ({
  isCommentSuspended: false,
  isSuspended: false,
  resetRestriction: () =>
    set(() => ({
      isCommentSuspended: false,
      isSuspended: false
    })),
  setRestriction: ({ isCommentSuspended, isSuspended }) =>
    set(() => ({
      isCommentSuspended,
      isSuspended
    }))
}));

export const useProfileRestriction = createTrackedSelector(store);
