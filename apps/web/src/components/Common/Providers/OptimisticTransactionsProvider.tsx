import { useTransactionStatusQuery } from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import type { FC } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const Transaction: FC<{ transaction: OptimisticTransaction }> = ({
  transaction
}) => {
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
          transaction.type === OptmisticTransactionType.Post &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
          setIndexedPostHash(transaction.txHash);
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
