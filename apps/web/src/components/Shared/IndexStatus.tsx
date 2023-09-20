import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { POLYGONSCAN_URL } from '@lenster/data/constants';
import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@lenster/lens';
import { Spinner } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

interface IndexStatusProps {
  type?: string;
  txHash: `0x${string}`;
  reload?: boolean;
}

const IndexStatus: FC<IndexStatusProps> = ({
  type = 'Transaction',
  txHash,
  reload = false
}) => {
  const [hide, setHide] = useState(false);
  const [pollInterval, setPollInterval] = useState(500);
  const { data, loading } = useLensTransactionStatusQuery({
    variables: { request: { forTxHash: txHash } },
    pollInterval,
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
    <Link
      className={cn({ hidden: hide }, 'ml-auto text-sm font-medium')}
      href={`${POLYGONSCAN_URL}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {loading ||
      data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Processing ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>
            <Trans>{type} Indexing</Trans>
          </div>
        </div>
      ) : data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Failed ? (
        <div className="flex items-center space-x-1.5">
          <XCircleIcon className="h-5 w-5 text-red-500" />
          <div>
            <Trans>Index failed</Trans>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <div className="text-black dark:text-white">
            <Trans>Index Successful</Trans>
          </div>
        </div>
      )}
    </Link>
  );
};

export default IndexStatus;
