import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface ProState {
  proLoaded: boolean;
  setProLoaded: (proLoaded: boolean) => void;
  loadingPro: boolean;
  setLoadingPro: (loadingPro: boolean) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  resetPro: () => void;
}

export const useProStore = create(
  persist<ProState>(
    (set) => ({
      proLoaded: false,
      setProLoaded: (proLoaded) => set(() => ({ proLoaded })),
      loadingPro: true,
      setLoadingPro: (loadingPro) => set(() => ({ loadingPro })),
      isPro: false,
      setIsPro: (isPro) => set(() => ({ isPro })),
      resetPro: () =>
        set(() => ({
          isPro: false
        }))
    }),
    {
      name: IndexDB.ProStore,
      storage: createIdbStorage()
    }
  )
);
