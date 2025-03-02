import type { GroupFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showSuperJoinModal: boolean;
  superJoiningGroup?: GroupFragment;
  setShowSuperJoinModal: (
    showSuperJoinModal: boolean,
    superJoiningGroup?: GroupFragment
  ) => void;
}

const store = create<State>((set) => ({
  showSuperJoinModal: false,
  superJoiningGroup: undefined,
  setShowSuperJoinModal: (showSuperJoinModal, superJoiningGroup) =>
    set(() => ({ showSuperJoinModal, superJoiningGroup }))
}));

export const useSuperJoinModalStore = createTrackedSelector(store);
