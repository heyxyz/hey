import type { HomeFeedType } from '@hey/data/enums';

import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface EnabledAlgorithmsState {
  disableAlgorithm: (algorithm: HomeFeedType) => void;
  enableAlgorithm: (algorithm: HomeFeedType) => void;
  enabledAlgorithms: HomeFeedType[];
}

export const useEnabledAlgorithmsStore = create(
  persist<EnabledAlgorithmsState>(
    (set) => ({
      disableAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: state.enabledAlgorithms.filter(
            (a) => a !== algorithm
          )
        }));
      },
      enableAlgorithm: (algorithm) => {
        set((state) => ({
          enabledAlgorithms: [...state.enabledAlgorithms, algorithm]
        }));
      },
      enabledAlgorithms: []
    }),
    {
      name: IndexDB.AlgorithmStore,
      storage: createIdbStorage()
    }
  )
);
