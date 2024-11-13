import type { AnyPublication } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  postContent: string;
  quotedPost: AnyPublication | null;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost: AnyPublication | null) => void;
  setTags: (tags: null | string[]) => void;
  tags: null | string[];
}

const store = create<State>((set) => ({
  postContent: "",
  quotedPost: null,
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost })),
  setTags: (tags) => set(() => ({ tags })),
  tags: null
}));

export const usePostStore = createTrackedSelector(store);
