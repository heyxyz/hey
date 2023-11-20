import type { HomeFeedType } from '@hey/data/enums';
import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface EnabledAlgorithmsState {
  enabledAlgorithms: HomeFeedType[];
  enableAlgorithm: (algorithm: HomeFeedType) => void;
  disableAlgorithm: (algorithm: HomeFeedType) => void;
}

export const useEnabledAlgorithmsStore = create(
  persist<EnabledAlgorithmsState>(
    (set) => ({
      enabledAlgorithms: [],
      enableAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: [...state.enabledAlgorithms, algorithm]
        }));
      },
      disableAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: state.enabledAlgorithms.filter(
            (a) => a !== algorithm
          )
        }));
      }
    }),
    {
      name: IndexDB.AlgorithmStore,
      storage: createIdbStorage()
    }
  )
);
