import { Localstorage } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  setTxnQueue: (txnQueue: any[]) => void;
  txnQueue: any[];
}

const store = create(
  persist<State>(
    (set) => ({
      setTxnQueue: (txnQueue) => set(() => ({ txnQueue })),
      txnQueue: []
    }),
    { name: Localstorage.TransactionStore }
  )
);

export const useTransactionStore = createTrackedSelector(store);
