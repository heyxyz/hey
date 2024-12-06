import { XMarkIcon } from "@heroicons/react/24/outline";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

interface TransactionProps {
  transaction: OptimisticTransaction;
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const { removeTransaction } = useTransactionStore();

  return (
    <div className="flex items-center justify-between">
      <Tooltip content={transaction.txHash} placement="top">
        {transaction.type === OptmisticPostType.Post ||
        transaction.type === OptmisticPostType.Quote ||
        transaction.type === OptmisticPostType.AssignUsername ||
        transaction.type === OptmisticPostType.UnassignUsername ? (
          <div className="text-sm">{transaction.type}</div>
        ) : transaction.type === OptmisticPostType.Follow ||
          transaction.type === OptmisticPostType.Unfollow ||
          transaction.type === OptmisticPostType.Block ||
          transaction.type === OptmisticPostType.Unblock ||
          transaction.type === OptmisticPostType.Mirror ||
          transaction.type === OptmisticPostType.Comment ||
          transaction.type === OptmisticPostType.Collect ? (
          <div className="text-sm">
            {transaction.type} on {transaction.followOn}
          </div>
        ) : null}
      </Tooltip>
      <div className="flex items-center space-x-2">
        <Tooltip content="Indexing" placement="top">
          <div className="flex size-4 items-center justify-center rounded-full bg-gray-200">
            <div className="size-2 animate-shimmer rounded-full bg-gray-500" />
          </div>
        </Tooltip>
        <button
          type="button"
          onClick={() => removeTransaction(transaction.txHash)}
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Transaction;
