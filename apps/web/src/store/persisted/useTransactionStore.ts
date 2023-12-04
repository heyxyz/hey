import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionState {
  setTxnQueue: (txnQueue: any[]) => void;
  txnQueue: any[];
}

export const useTransactionStore = create(
  persist<TransactionState>(
    (set) => ({
      setTxnQueue: (txnQueue) => set(() => ({ txnQueue })),
      txnQueue: []
    }),
    { name: Localstorage.TransactionStore }
  )
);
