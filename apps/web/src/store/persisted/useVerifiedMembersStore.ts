import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface VerifiedMembersState {
  hydrateVerifiedMembers: () => { verifiedMembers: string[] };
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  verifiedMembers: string[];
}

export const useVerifiedMembersStore = create(
  persist<VerifiedMembersState>(
    (set, get) => ({
      hydrateVerifiedMembers: () => {
        return {
          verifiedMembers: get().verifiedMembers
        };
      },
      setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
      verifiedMembers: []
    }),
    {
      name: IndexDB.VerifiedMembersStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateVerifiedMembers = () =>
  useVerifiedMembersStore.getState().hydrateVerifiedMembers();
