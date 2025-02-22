import type { Group } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showJoinGroupModal: boolean;
  joiningGroup: null | Group;
  setShowJoinGroupModal: (
    showJoinGroupModal: boolean,
    joiningGroup: null | Group
  ) => void;
}

const store = create<State>((set) => ({
  showJoinGroupModal: false,
  joiningGroup: null,
  setShowJoinGroupModal: (showJoinGroupModal, joiningGroup) =>
    set(() => ({ showJoinGroupModal, joiningGroup }))
}));

export const useJoinGroupModalStore = createTrackedSelector(store);
