import { useApolloClient } from "@apollo/client";
import {
  PostDocument,
  usePostLazyQuery,
  useTransactionStatusQuery
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const Transaction: FC<{ transaction: OptimisticTransaction }> = ({
  transaction
}) => {
  const { reload } = useRouter();
  const { removeTransaction } = useTransactionStore();
  const { cache } = useApolloClient();
  const [getPost] = usePostLazyQuery();

  useTransactionStatusQuery({
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000,
    variables: { request: { txHash: transaction.txHash } },
    onCompleted: async ({ transactionStatus }) => {
      if (
        transactionStatus?.__typename === "FailedTransactionStatus" ||
        transactionStatus?.__typename === "FinishedTransactionStatus"
      ) {
        // Push new post to the feed
        if (
          transaction.type === OptimisticTxType.CREATE_POST &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
          const { data } = await getPost({
            variables: { request: { txHash: transaction.txHash } }
          });

          if (data?.post) {
            cache.modify({
              fields: {
                posts: () => {
                  cache.writeQuery({ data: data.post, query: PostDocument });
                }
              }
            });
          }
        }

        // Push new comment to the feed
        if (
          transaction.type === OptimisticTxType.CREATE_COMMENT &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
          if (transaction.commentOn) {
            const post = await getPost({
              variables: { request: { txHash: transaction.txHash } }
            });
            if (post) {
              cache.modify({
                fields: {
                  postReferences: () => {
                    cache.writeQuery({ data: post, query: PostDocument });
                  }
                }
              });
            }
          }
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
    }
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
