import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import getPostsTips from "@hey/helpers/api/getPostsTips";
import type { PostTip } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  addTip: (id: string) => void;
  fetchAndStoreTips: (ids: string[]) => void;
  postTips: PostTip[];
}

const store = create<State>((set, get) => ({
  addTip: (id) => {
    const existingTip = get().postTips.find((tip) => tip.id === id);
    if (existingTip) {
      set((state) => ({
        postTips: state.postTips.map((tip) =>
          tip.id === id ? { ...tip, count: tip.count + 1, tipped: true } : tip
        )
      }));
    } else {
      set((state) => ({
        postTips: [...state.postTips, { count: 1, id, tipped: true }]
      }));
    }
  },
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const tipsResponse = await getPostsTips(ids, getAuthApiHeaders());
    set((state) => ({
      postTips: [...state.postTips, ...tipsResponse]
    }));
  },
  postTips: []
}));

export const useTipsStore = createTrackedSelector(store);
