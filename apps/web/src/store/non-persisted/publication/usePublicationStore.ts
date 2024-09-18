import type { AnyPublication } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
  setTags: (tags: null | string[]) => void;
  tags: null | string[];
}

const store = create<State>((set) => ({
  publicationContent: "",
  quotedPublication: null,
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication })),
  setTags: (tags) => set(() => ({ tags })),
  tags: null
}));

export const usePublicationStore = createTrackedSelector(store);
