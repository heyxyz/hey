import type { Profile } from '@hey/lens';
import type { StorageValue } from 'zustand/middleware';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ILensProfilesStore {
  lensProfiles: Map<string, Profile>;
  setLensProfiles: (lensProfiles: Map<string, Profile>) => void;
}

export const useLensProfilesStore = create(
  persist<ILensProfilesStore>(
    (set) => ({
      lensProfiles: new Map(),
      setLensProfiles: (lensProfiles: Map<string, Profile>) =>
        set(() => ({ lensProfiles: new Map(lensProfiles) }))
    }),
    {
      name: 'lensProfilesStore',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) {
            return null;
          }
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              lensProfiles: new Map(state.lensProfiles)
            }
          };
        },
        removeItem: (name) => localStorage.removeItem(name),
        setItem: (name, newValue: StorageValue<ILensProfilesStore>) => {
          // functions cannot be JSON encoded
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              lensProfiles: Array.from(newValue.state.lensProfiles.entries())
            }
          });
          localStorage.setItem(name, str);
        }
      }
    }
  )
);
