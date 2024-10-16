import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  isCommentSuspended: boolean;
  isSuspended: boolean;
  hasSuspendWarning: boolean;
  resetStatus: () => void;
  setStatus: ({
    isCommentSuspended,
    isSuspended,
    hasSuspendWarning
  }: {
    isCommentSuspended: boolean;
    isSuspended: boolean;
    hasSuspendWarning: boolean;
  }) => void;
}

const store = create<State>((set) => ({
  isCommentSuspended: false,
  isSuspended: false,
  hasSuspendWarning: false,
  resetStatus: () =>
    set(() => ({
      isCommentSuspended: false,
      isSuspended: false,
      hasSuspendWarning: false
    })),
  setStatus: ({ isCommentSuspended, isSuspended, hasSuspendWarning }) =>
    set(() => ({
      isCommentSuspended,
      isSuspended,
      hasSuspendWarning
    }))
}));

export const useProfileStatus = createTrackedSelector(store);
