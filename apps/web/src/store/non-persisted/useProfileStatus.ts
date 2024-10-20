import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  isCommentSuspended: boolean;
  isSuspended: boolean;
  resetStatus: () => void;
  setStatus: ({
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
  resetStatus: () =>
    set(() => ({
      isCommentSuspended: false,
      isSuspended: false
    })),
  setStatus: ({ isCommentSuspended, isSuspended }) =>
    set(() => ({
      isCommentSuspended,
      isSuspended
    }))
}));

export const useProfileStatus = createTrackedSelector(store);
