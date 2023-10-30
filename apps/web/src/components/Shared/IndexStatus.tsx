import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@hey/lens';
import { Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useState } from 'react';
import type { Address } from 'viem';

interface IndexStatusProps {
  message?: string;
  txHash?: Address;
  txId?: string;
  reload?: boolean;
}

const IndexStatus: FC<IndexStatusProps> = ({
  message = 'Transaction Indexing',
  txHash,
  txId,
  reload = false
}) => {
  const [hide, setHide] = useState(false);
  const [pollInterval, setPollInterval] = useState(500);
  const { data, loading } = useLensTransactionStatusQuery({
    variables: { request: { forTxHash: txHash, forTxId: txId } },
    pollInterval,
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
          <XCircleIcon className="h-5 w-5 text-red-500" />
          <div>Index failed</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <div className="text-black dark:text-white">Index Successful</div>
        </div>
      )}
    </span>
  );
};

export default IndexStatus;
