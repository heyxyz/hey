import { Localstorage } from '@lenster/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EnabledAlgorithmsPerisistState {
  enabledAlgorithms: string[];
  isEnabled: (algorithm: string) => boolean;
  addAlgorithm: (algorithm: string) => void;
  removeAlgorithm: (algorithm: string) => void;
}

export const useEnabledAlgorithmsPersistStore = create(
  persist<EnabledAlgorithmsPerisistState>(
    (set, get) => ({
      enabledAlgorithms: [],
      isEnabled: (algorithm) => {
        return get().enabledAlgorithms.includes(algorithm);
      },
      addAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: [...state.enabledAlgorithms, algorithm]
        }));
      },
      removeAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: state.enabledAlgorithms.filter(
            (a) => a !== algorithm
          )
        }));
      }
    }),
    { name: Localstorage.AlgorithmStore }
  )
);
