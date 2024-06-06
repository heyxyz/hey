import type { AllowedToken } from '@good/types/good';

import { IndexDB } from '@good/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../helpers/createIdbStorage';

interface State {
  allowedTokens: [] | AllowedToken[];
  setAllowedTokens: (allowedTokens: AllowedToken[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      allowedTokens: [],
      setAllowedTokens: (allowedTokens) => set(() => ({ allowedTokens }))
    }),
    { name: IndexDB.AllowedTokensStore, storage: createIdbStorage() }
  )
);

export const useAllowedTokensStore = createTrackedSelector(store);
