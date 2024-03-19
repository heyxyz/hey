import type { OptimisticTransaction } from '@hey/types/misc';

import { IndexDB } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface State {
  addTransaction: (txn: OptimisticTransaction) => void;
  removeTransaction: (hashOrId: string) => void;
  reset: () => void;
  txnQueue: OptimisticTransaction[];
}

const store = create(
  persist<State>(
    (set) => ({
      addTransaction: (txn) =>
        set((state) => ({ txnQueue: [...state.txnQueue, txn] })),
      removeTransaction: (hashOrId) =>
        set((state) => ({
          txnQueue: state.txnQueue.filter(
            (txn) => txn.txHash !== hashOrId && txn.txId !== hashOrId
          )
        })),
      reset: () => set({ txnQueue: [] }),
      txnQueue: []
    }),
    {
      name: IndexDB.TransactionStore,
      storage: createIdbStorage()
    }
  )
);

export const useTransactionStore = createTrackedSelector(store);
