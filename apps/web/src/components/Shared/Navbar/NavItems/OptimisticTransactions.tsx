import type { FC } from 'react';

import { CircleStackIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface OptimisticTransactionsProps {
  className?: string;
}

const OptimisticTransactions: FC<OptimisticTransactionsProps> = ({
  className = ''
}) => {
  const { setStaffMode, staffMode } = useFeatureFlagsStore();
  const { txnQueue } = useTransactionStore();
  const {
    setShowOptimisticTransactionsModal,
    showOptimisticTransactionsModal
  } = useGlobalModalStateStore();

  const toggleStaffMode = () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/staffMode`,
        { enabled: !staffMode },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to toggle staff mode!',
        loading: 'Toggling staff mode...',
        success: () => {
          setStaffMode(!staffMode);
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE, {
            enabled: !staffMode
          });

          return 'Staff mode toggled!';
        }
      }
    );
  };

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
