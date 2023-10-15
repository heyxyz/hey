import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import { Button, Spinner } from '@hey/ui';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

interface PendingProps {
  handle: string;
  txId: string;
}

const Pending: FC<PendingProps> = ({ handle, txId }) => {
  const [pollInterval, setPollInterval] = useState(500);

  const { data, loading } = useLensTransactionStatusQuery({
    variables: { request: { forTxId: txId } },
    pollInterval,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ lensTransactionStatus }) => {
      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        setPollInterval(0);
      }
    }
  });

  return (
    <div className="p-5 text-center font-bold">
      {loading ||
      !data?.lensTransactionStatus ||
      data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Processing ? (
        <div className="space-y-3">
          <Spinner className="mx-auto" />
          <div>Account creation in progress, please wait!</div>
        </div>
      ) : data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Failed ? (
        <div className="space-y-3">
          <XCircleIcon className="mx-auto h-10 w-10 text-red-500" />
          <div>Account creation failed!</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <Link href={`/u/${formatHandle(handle)}`}>
              <Button
                className="mx-auto"
                icon={<ArrowRightIcon className="mr-1 h-4 w-4" />}
              >
                Go to profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;
