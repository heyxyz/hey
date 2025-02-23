import type { Group } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showSuperJoinModal: boolean;
  superJoiningGroup: null | Group;
  setShowSuperJoinModal: (
    showSuperJoinModal: boolean,
    superJoiningGroup: null | Group
  ) => void;
}

const store = create<State>((set) => ({
  showSuperJoinModal: false,
  superJoiningGroup: null,
  setShowSuperJoinModal: (showSuperJoinModal, superJoiningGroup) =>
    set(() => ({ showSuperJoinModal, superJoiningGroup }))
}));

export const useSuperJoinModalStore = createTrackedSelector(store);
