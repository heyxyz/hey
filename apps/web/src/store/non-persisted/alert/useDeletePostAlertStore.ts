import type { Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  deletingPost: Post | null;
  showPostDeleteAlert: boolean;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost: Post | null
  ) => void;
}

const store = create<State>((set) => ({
  deletingPost: null,
  showPostDeleteAlert: false,
  setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
    set(() => ({ deletingPost, showPostDeleteAlert }))
}));

export const useDeletePostAlertStore = createTrackedSelector(store);
