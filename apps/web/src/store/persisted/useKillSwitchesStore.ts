import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface KillSwitchesState {
  hydrateKillSwitches: () => { killSwitches: string[] };
  killSwitches: string[];
  setKillSwitches: (killSwitches: string[]) => void;
}

export const useKillSwitchesStore = create(
  persist<KillSwitchesState>(
    (set, get) => ({
      hydrateKillSwitches: () => {
        return { killSwitches: get().killSwitches };
      },
      killSwitches: [],
      setKillSwitches: (killSwitches) => set(() => ({ killSwitches }))
    }),
    {
      name: IndexDB.KillSwitchesStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateKillSwitches = () =>
  useKillSwitchesStore.getState().hydrateKillSwitches();
