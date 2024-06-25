import type { FC } from 'react';
import type { Address } from 'viem';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@hey/lens';
import { Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
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

  const getStatusContent = () => {
    if (
      loading ||
      !data?.lensTransactionStatus ||
      data.lensTransactionStatus.status === LensTransactionStatusType.Processing
    ) {
      return (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{message}</div>
        </div>
      );
    }

    if (
      data.lensTransactionStatus.status === LensTransactionStatusType.Failed
    ) {
      return (
        <div className="flex items-center space-x-1.5">
          <XCircleIcon className="size-5 text-red-500" />
          <div>Index failed</div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <CheckCircleIcon className="size-5 text-green-500" />
        <div className="text-black dark:text-white">Index Successful</div>
      </div>
    );
  };

  return (
    <span className={cn({ hidden: hide }, 'ml-auto text-sm font-medium')}>
      {getStatusContent()}
    </span>
  );
};

export default IndexStatus;
