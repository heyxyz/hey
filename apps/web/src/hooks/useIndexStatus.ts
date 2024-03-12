import type { Address } from 'viem';

import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@hey/lens';
import { useState } from 'react';

interface TransactionStatusProps {
  reload?: boolean;
  txHash?: Address;
  txId?: string;
}

export function useTransactionStatus({
  reload,
  txHash,
  txId
}: TransactionStatusProps) {
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

  return { data, hide, loading };
}
