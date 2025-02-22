import { Localstorage } from "@hey/data/storage";
import type { OptimisticPublication } from "@hey/types/misc";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  addPublication: (txn: OptimisticPublication) => void;
  removePublication: (hash: string) => void;
  reset: () => void;
  txnQueue: OptimisticPublication[];
}

const store = create(
  persist<State>(
    (set) => ({
      addPublication: (txn) =>
        set((state) => ({ txnQueue: [...state.txnQueue, txn] })),
      removePublication: (hash) =>
        set((state) => ({
          txnQueue: state.txnQueue.filter((txn) => txn.txHash !== hash)
        })),
      reset: () => set({ txnQueue: [] }),
      txnQueue: []
    }),
    { name: Localstorage.TransactionStore }
  )
);

export const addOptimisticPublication = store.getState().addPublication;
export const useOptimisticPublicationStore = store;
