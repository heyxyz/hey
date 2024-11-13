import type { AnyPublication } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  publicationContent: string;
  quotedPost: AnyPublication | null;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPost: (quotedPost: AnyPublication | null) => void;
  setTags: (tags: null | string[]) => void;
  tags: null | string[];
}

const store = create<State>((set) => ({
  publicationContent: "",
  quotedPost: null,
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost })),
  setTags: (tags) => set(() => ({ tags })),
  tags: null
}));

export const usePublicationStore = createTrackedSelector(store);
