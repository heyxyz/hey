import type { Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  postContent: string;
  quotedPost: Post | null;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost: Post | null) => void;
}

const store = create<State>((set) => ({
  postContent: "",
  quotedPost: null,
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost }))
}));

export const usePostStore = createTrackedSelector(store);
