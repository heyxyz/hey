import create from 'zustand';

interface Transaction {
  platformName?: string;
  status: 'completed' | 'error' | 'pending';
  txHash: string;
}

interface OaTransactionStoreState {
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (txHash: string) => void;
  transactions: Transaction[];
}

export const useOaTransactionStore = create<OaTransactionStoreState>((set) => ({
  addTransaction: (tx) =>
    set((state) => ({ transactions: [...state.transactions, tx] })),
  removeTransaction: (txHash) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.txHash !== txHash)
    })),
  transactions: []
}));
