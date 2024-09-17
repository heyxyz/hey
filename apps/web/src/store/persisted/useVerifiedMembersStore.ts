import { IndexDB } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import createIdbStorage from "../helpers/createIdbStorage";

interface State {
  hydrateVerifiedMembers: () => { verifiedMembers: string[] };
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  verifiedMembers: string[];
}

const store = create(
  persist<State>(
    (set, get) => ({
      hydrateVerifiedMembers: () => {
        return {
          verifiedMembers: get().verifiedMembers
        };
      },
      setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
      verifiedMembers: []
    }),
    { name: IndexDB.VerifiedMembersStore, storage: createIdbStorage() }
  )
);

export const hydrateVerifiedMembers = () =>
  store.getState().hydrateVerifiedMembers();
export const useVerifiedMembersStore = createTrackedSelector(store);
