import type { PostFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  postContent: string;
  quotedPost?: PostFragment;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost?: PostFragment) => void;
}

const store = create<State>((set) => ({
  postContent: "",
  quotedPost: undefined,
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost }))
}));

export const usePostStore = createTrackedSelector(store);
