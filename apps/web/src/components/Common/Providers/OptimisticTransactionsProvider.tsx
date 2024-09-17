import type { OptimisticTransaction } from "@hey/types/misc";
import type { FC } from "react";

import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from "@hey/lens";
import { OptmisticPublicationType } from "@hey/types/enums";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const Transaction: FC<{ transaction: OptimisticTransaction }> = ({
  transaction
}) => {
  const { removeTransaction, setIndexedPostHash } = useTransactionStore();

  useLensTransactionStatusQuery({
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ lensTransactionStatus }) => {
      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Failed ||
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        // Trigger Profile feed refetch
        if (
          transaction.type === OptmisticPublicationType.Post &&
          lensTransactionStatus.txHash
        ) {
          setIndexedPostHash(lensTransactionStatus.txHash);
        }

        return removeTransaction(
          (transaction.txId || transaction.txHash) as string
        );
      }
    },
    pollInterval: 3000,
    variables: {
      request: {
        ...(transaction.txId && { forTxId: transaction.txId }),
        ...(transaction.txHash && { forTxHash: transaction.txHash })
      }
    }
  });

  return null;
};

const OptimisticTransactionsProvider: FC = () => {
  const { txnQueue } = useTransactionStore();

  return (
    <>
      {txnQueue.map((txn) => (
        <Transaction key={txn.txId || txn.txHash} transaction={txn} />
      ))}
    </>
  );
};

export default OptimisticTransactionsProvider;
