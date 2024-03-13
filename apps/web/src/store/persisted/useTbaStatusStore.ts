import { IndexDB } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface State {
  hydrateTbaStatus: () => { isTba: boolean };
  isTba: boolean;
  setIsTba: (isTba: boolean) => void;
}

const store = create(
  persist<State>(
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

export const hydrateTbaStatus = () => store.getState().hydrateTbaStatus();
export const useTbaStatusStore = createTrackedSelector(store);
