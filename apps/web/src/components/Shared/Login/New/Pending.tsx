import type { FC } from 'react';

import { XCircleIcon } from '@heroicons/react/24/solid';
import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@hey/lens';
import { Spinner } from '@hey/ui';
import { useState } from 'react';

interface PendingProps {
  txId: string;
}

const Pending: FC<PendingProps> = ({ txId }) => {
  const [pollInterval, setPollInterval] = useState(500);

  const { data, loading } = useLensTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ lensTransactionStatus }) => {
      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        setPollInterval(0);
      }
    },
    pollInterval,
    variables: { request: { forTxId: txId } }
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
          <XCircleIcon className="mx-auto size-10 text-red-500" />
          <div>Account creation failed!</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
        </div>
      )}
    </div>
  );
};

export default Pending;
