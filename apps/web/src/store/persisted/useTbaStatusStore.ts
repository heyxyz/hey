import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface TbaStatusState {
  hydrateTbaStatus: () => { isTba: boolean };
  isTba: boolean;
  setIsTba: (isTba: boolean) => void;
}

export const useTbaStatusStore = create(
  persist<TbaStatusState>(
    (set, get) => ({
      hydrateTbaStatus: () => {
        return { isTba: get().isTba };
      },
      isTba: false,
      setIsTba: (isTba) => set(() => ({ isTba }))
    }),
    {
      name: IndexDB.TBAStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateTbaStatus = () =>
  useTbaStatusStore.getState().hydrateTbaStatus();
