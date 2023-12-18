import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface KeyState {
  pgpPvtKey: string;
  setPgpPvtKey: (currentPgpPvtKey: string) => void;
}

export const useMessageStore = create(
  persist<KeyState>(
    (set) => ({
      pgpPvtKey: '',
      setPgpPvtKey: (currentPgpPvtKey) =>
        set(() => ({ pgpPvtKey: currentPgpPvtKey }))
    }),
    {
      name: IndexDB.MessageStore,
      storage: createIdbStorage()
    }
  )
);

export default useMessageStore;
