import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
}

const store = create<State>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal }))
}));

export const useNewPostModalStore = createTrackedSelector(store);
