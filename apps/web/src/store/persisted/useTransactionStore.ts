import type { OptimisticTransaction } from '@hey/types/misc';

import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface State {
  addTransaction: (txn: OptimisticTransaction) => void;
  hydrateTxnQueue: () => OptimisticTransaction[];
  isFollowPending: (profileId: string) => boolean;
  isUnfollowPending: (profileId: string) => boolean;
  removeTransaction: (hashOrId: string) => void;
  reset: () => void;
  txnQueue: OptimisticTransaction[];
}

const store = create(
  persist<State>(
    (set, get) => ({
      addTransaction: (txn) =>
        set((state) => ({ txnQueue: [...state.txnQueue, txn] })),
      hydrateTxnQueue: () => {
        return get().txnQueue;
      },
      isFollowPending: (profileId) =>
        get().txnQueue.some((txn) => txn.followOn === profileId),
      isUnfollowPending: (profileId) =>
        get().txnQueue.some((txn) => txn.unfollowOn === profileId),
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

export const hydrateTxnQueue = () => store.getState().hydrateTxnQueue();
export const useTransactionStore = store;
