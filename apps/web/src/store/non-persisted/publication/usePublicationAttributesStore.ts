import type { MetadataAttribute } from "@lens-protocol/metadata";

import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  addAttribute: (attribute: MetadataAttribute) => void;
  attributes: MetadataAttribute[] | undefined;
  getAttribute: (key: string) => MetadataAttribute | undefined;
  removeAttribute: (key: string) => void;
  reset: () => void;
  updateAttribute: (key: string, value: string) => void;
}

const store = create<State>((set, get) => ({
  addAttribute: (attribute) =>
    set((state) => ({
      attributes: state.attributes
        ? [...state.attributes, attribute]
        : [attribute]
    })),
  attributes: undefined,
  getAttribute: (key) =>
    get().attributes?.find((attribute) => attribute.key === key),
  removeAttribute: (key) =>
    set((state) => ({
      attributes: state.attributes?.filter((attribute) => attribute.key !== key)
    })),
  reset: () => set({ attributes: undefined }),
  updateAttribute: (key, value: any) =>
    set((state) => ({
      attributes: state.attributes?.map((attribute) =>
        attribute.key === key ? { ...attribute, value } : attribute
      )
    }))
}));

export const usePublicationAttributesStore = createTrackedSelector(store);
