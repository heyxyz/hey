import { useTransactionStatusQuery } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const Transaction: FC<{ transaction: OptimisticTransaction }> = ({
  transaction
}) => {
  const { reload } = useRouter();
  const { removeTransaction, setIndexedPostHash } = useTransactionStore();

  useTransactionStatusQuery({
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ transactionStatus }) => {
      if (
        transactionStatus?.__typename === "FailedTransactionStatus" ||
        transactionStatus?.__typename === "FinishedTransactionStatus"
      ) {
        // Trigger Account feed refetch
        if (
          transaction.type === OptimisticTxType.CREATE_POST &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
          setIndexedPostHash(transaction.txHash);
        }

        // Reload the page when signless toggle is successful
        if (
          transaction.type === OptimisticTxType.TOGGLE_SIGNLESS &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
          reload();
        }

        return removeTransaction(transaction.txHash as string);
      }
    },
    pollInterval: 1000,
    variables: { request: { txHash: transaction.txHash } }
  });

  return null;
};

const OptimisticTransactionsProvider: FC = () => {
  const { txnQueue } = useTransactionStore();

  return (
    <>
      {txnQueue.map((txn) => (
        <Transaction key={txn.txHash} transaction={txn} />
      ))}
    </>
  );
};

export default OptimisticTransactionsProvider;
