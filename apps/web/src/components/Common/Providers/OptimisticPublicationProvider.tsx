import { useApolloClient } from "@apollo/client";
import {
  PostDocument,
  usePostLazyQuery,
  useTransactionStatusQuery
} from "@hey/indexer";
import type { OptimisticPublication } from "@hey/types/misc";
import type { FC } from "react";
import { useOptimisticPublicationStore } from "src/store/persisted/useOptimisticPublicationStore";

const Transaction: FC<{ transaction: OptimisticPublication }> = ({
  transaction
}) => {
  const { removePublication } = useOptimisticPublicationStore();
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
          !transaction.commentOn &&
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
          transaction.commentOn &&
          transactionStatus.__typename === "FinishedTransactionStatus"
        ) {
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

        return removePublication(transaction.txHash as string);
      }
    }
  });

  return null;
};

const OptimisticPublicationProvider: FC = () => {
  const { txnQueue } = useOptimisticPublicationStore();

  return (
    <>
      {txnQueue.map((txn) => (
        <Transaction key={txn.txHash} transaction={txn} />
      ))}
    </>
  );
};

export default OptimisticPublicationProvider;
