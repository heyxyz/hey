import type { FC } from "react";

import { CircleStackIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "@hey/ui";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

import Transaction from "./Transaction";

const OptimisticTransactions: FC = () => {
  const { txnQueue } = useTransactionStore();

  if (txnQueue.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<CircleStackIcon className="size-8" />}
        message="No transactions"
      />
    );
  }

  return (
    <div className="max-h-[80vh] space-y-5 overflow-y-auto p-5">
      {txnQueue.map((transaction) => (
        <Transaction key={transaction.txId} transaction={transaction} />
      ))}
    </div>
  );
};

export default OptimisticTransactions;
