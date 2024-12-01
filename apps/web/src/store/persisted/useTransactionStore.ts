import { Localstorage } from "@hey/data/storage";
import type { OptimisticTransaction } from "@hey/types/misc";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  addTransaction: (txn: OptimisticTransaction) => void;
  hydrateTxnQueue: () => OptimisticTransaction[];
  indexedPostHash: null | string;
  isFollowPending: (profileAddress: string) => boolean;
  isUnfollowPending: (profileAddress: string) => boolean;
  removeTransaction: (hashOrId: string) => void;
  reset: () => void;
  setIndexedPostHash: (hash: string) => void;
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
      indexedPostHash: null,
      isFollowPending: (profileAddress) =>
        get().txnQueue.some((txn) => txn.followOn === profileAddress),
      isUnfollowPending: (profileAddress) =>
        get().txnQueue.some((txn) => txn.unfollowOn === profileAddress),
      removeTransaction: (hashOrId) =>
        set((state) => ({
          txnQueue: state.txnQueue.filter(
            (txn) => txn.txHash !== hashOrId && txn.txId !== hashOrId
          )
        })),
      reset: () => set({ txnQueue: [] }),
      setIndexedPostHash: (hash) => set({ indexedPostHash: hash }),
      txnQueue: []
    }),
    { name: Localstorage.TransactionStore }
  )
);

export const hydrateTxnQueue = () => store.getState().hydrateTxnQueue();
export const useTransactionStore = store;
