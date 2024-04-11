import type { FC } from 'react';

import { CircleStackIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface OptimisticTransactionsProps {
  className?: string;
}

const OptimisticTransactions: FC<OptimisticTransactionsProps> = ({
  className = ''
}) => {
  const { txnQueue } = useTransactionStore();
  const { setShowOptimisticTransactionsModal } = useGlobalModalStateStore();

  if (txnQueue.length === 0) {
    return null;
  }

  return (
    <button
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => setShowOptimisticTransactionsModal(true)}
      type="button"
    >
      <CircleStackIcon className="size-4" />
      <div>Transactions</div>
    </button>
  );
};

export default OptimisticTransactions;
