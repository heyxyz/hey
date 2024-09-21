import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    { name: Localstorage.VerifiedMembersStore }
  )
);

export const hydrateVerifiedMembers = () =>
  store.getState().hydrateVerifiedMembers();
export const useVerifiedMembersStore = createTrackedSelector(store);
