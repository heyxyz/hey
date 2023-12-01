import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface VerifiedMembersState {
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  hydrateVerifiedMembers: () => { verifiedMembers: string[] };
}

export const useVerifiedMembersStore = create(
  persist<VerifiedMembersState>(
    (set, get) => ({
      verifiedMembers: [],
      setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
      hydrateVerifiedMembers: () => {
        return {
          verifiedMembers: get().verifiedMembers
        };
      }
    }),
    {
      name: IndexDB.VerifiedMembersStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateVerifiedMembers = () =>
  useVerifiedMembersStore.getState().hydrateVerifiedMembers();
