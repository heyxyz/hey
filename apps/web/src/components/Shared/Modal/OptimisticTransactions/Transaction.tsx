import type { OptimisticTransaction } from '@hey/types/misc';
import type { FC } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Tooltip } from '@hey/ui';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface TransactionProps {
  transaction: OptimisticTransaction;
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const { removeTransaction } = useTransactionStore();

  return (
    <div className="flex items-center justify-between">
      <Tooltip content={transaction.txId || transaction.txHash} placement="top">
        {transaction.type === OptmisticPublicationType.Collect ? (
          <div className="text-sm">
            {transaction.type} on {transaction.collectOn}
          </div>
        ) : transaction.type === OptmisticPublicationType.Comment ? (
          <div className="text-sm">
            {transaction.type} on {transaction.commentOn}
          </div>
        ) : transaction.type === OptmisticPublicationType.Post ||
          transaction.type === OptmisticPublicationType.Quote ? (
          <div className="text-sm">{transaction.type}</div>
        ) : null}
      </Tooltip>
      <div className="flex items-center space-x-2">
        <Tooltip content="Indexing" placement="top">
          <div className="flex size-4 items-center justify-center rounded-full bg-gray-200">
            <div className="animate-shimmer size-2 rounded-full bg-gray-500" />
          </div>
        </Tooltip>
        <button
          onClick={() =>
            removeTransaction(
              (transaction.txId || transaction.txHash) as string
            )
          }
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Transaction;
