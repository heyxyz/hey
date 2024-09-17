import type { PublicationTip } from "@hey/types/hey";

import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import getPublicationsTips from "@hey/helpers/api/getPublicationsTips";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  addTip: (id: string) => void;
  fetchAndStoreTips: (ids: string[]) => void;
  publicationTips: PublicationTip[];
}

const store = create<State>((set, get) => ({
  addTip: (id) => {
    const existingTip = get().publicationTips.find((tip) => tip.id === id);
    if (existingTip) {
      set((state) => ({
        publicationTips: state.publicationTips.map((tip) =>
          tip.id === id ? { ...tip, count: tip.count + 1, tipped: true } : tip
        )
      }));
    } else {
      set((state) => ({
        publicationTips: [
          ...state.publicationTips,
          { count: 1, id, tipped: true }
        ]
      }));
    }
  },
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const tipsResponse = await getPublicationsTips(ids, getAuthApiHeaders());
    set((state) => ({
      publicationTips: [...state.publicationTips, ...tipsResponse]
    }));
  },
  publicationTips: []
}));

export const useTipsStore = createTrackedSelector(store);
