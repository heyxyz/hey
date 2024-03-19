import type { FC } from 'react';

import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

import Transaction from './Transaction';

const OptimisticTransactions: FC = () => {
  const { txnQueue } = useTransactionStore();

  return (
    <div className="max-h-[80vh] space-y-5 overflow-y-auto p-5">
      {txnQueue.map((transaction) => (
        <Transaction key={transaction.txId} transaction={transaction} />
      ))}
    </div>
  );
};

export default OptimisticTransactions;
