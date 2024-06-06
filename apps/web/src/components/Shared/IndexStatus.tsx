import type { FC } from 'react';
import type { Address } from 'viem';

import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@good/lens';
import { Spinner } from '@good/ui';
import cn from '@good/ui/cn';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface IndexStatusProps {
  message?: string;
  reload?: boolean;
  txHash?: Address;
  txId?: string;
}

const IndexStatus: FC<IndexStatusProps> = ({
  message = 'Transaction Indexing',
  reload = false,
  txHash,
  txId
}) => {
  const [hide, setHide] = useState(false);
  const [pollInterval, setPollInterval] = useState(500);
  const { data, loading } = useLensTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ lensTransactionStatus }) => {
      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        setPollInterval(0);
        if (reload) {
          location.reload();
        }
        setTimeout(() => {
          setHide(true);
        }, 5000);
      }
    },
    pollInterval,
    variables: {
      request: {
        ...(txHash && { forTxHash: txHash }),
        ...(txId && { forTxId: txId })
      }
    }
  });

  return (
    <span className={cn({ hidden: hide }, 'ml-auto text-sm font-medium')}>
      {loading ||
      !data?.lensTransactionStatus ||
      data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Processing ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{message}</div>
        </div>
      ) : data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Failed ? (
        <div className="flex items-center space-x-1.5">
          <XCircleIcon className="size-5 text-red-500" />
          <div>Index failed</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="size-5 text-green-500" />
          <div className="text-black dark:text-white">Index Successful</div>
        </div>
      )}
    </span>
  );
};

export default IndexStatus;
