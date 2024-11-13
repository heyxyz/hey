import getPostsViews from "@hey/helpers/getPostsViews";
import type { PostViewCount } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  fetchAndStoreViews: (ids: string[]) => void;
  postViews: PostViewCount[];
}

const store = create<State>((set) => ({
  fetchAndStoreViews: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPostsViews(ids);
    set((state) => ({
      postViews: [...state.postViews, ...viewsResponse]
    }));
  },
  postViews: []
}));

export const useImpressionsStore = createTrackedSelector(store);
