import { Localstorage } from '@lenster/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModePersistState {
  modMode: boolean;
  setModMode: (modMode: boolean) => void;
}

export const useModePersistStore = create(
  persist<ModePersistState>(
    (set) => ({
      modMode: false,
      setModMode: (modMode) => set(() => ({ modMode }))
    }),
    { name: Localstorage.ModeStore }
  )
);
