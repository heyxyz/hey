import { Localstorage } from '@lenster/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModePersistState {
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  modMode: boolean;
  setModMode: (modMode: boolean) => void;
}

export const useModePersistStore = create(
  persist<ModePersistState>(
    (set) => ({
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      modMode: false,
      setModMode: (modMode) => set(() => ({ modMode }))
    }),
    { name: Localstorage.ModeStore }
  )
);
