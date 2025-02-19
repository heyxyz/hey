import type { Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  disablingPost: Post | null;
  showDisableCollectAlert: boolean;
  setShowDisableCollectAlert: (
    showDisableCollectAlert: boolean,
    disablingPost: Post | null
  ) => void;
}

const store = create<State>((set) => ({
  disablingPost: null,
  showDisableCollectAlert: false,
  setShowDisableCollectAlert: (showDisableCollectAlert, disablingPost) =>
    set(() => ({ disablingPost, showDisableCollectAlert }))
}));

export const useDisableCollectAlertStore = createTrackedSelector(store);
