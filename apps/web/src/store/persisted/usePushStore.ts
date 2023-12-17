import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface KeyState {
  pgpPvtKey: string;
  setPgpPvtKey: (currentPgpPvtKey: string) => void;
}

export const usePushStore = create(
  persist<KeyState>(
    (set) => ({
      pgpPvtKey: '',
      setPgpPvtKey: (currentPgpPvtKey) =>
        set(() => ({ pgpPvtKey: currentPgpPvtKey }))
    }),
    {
      name: IndexDB.PushStore,
      storage: createIdbStorage()
    }
  )
);

export default usePushStore;
