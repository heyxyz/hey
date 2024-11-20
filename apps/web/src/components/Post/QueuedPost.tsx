import { useApolloClient } from "@apollo/client";
import Markup from "@components/Shared/Markup";
import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import getMentions from "@hey/helpers/getMentions";
import type { Profile } from "@hey/lens";
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery
} from "@hey/lens";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Card, Tooltip } from "@hey/ui";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface QueuedPostProps {
  txn: OptimisticTransaction;
}

const QueuedPost: FC<QueuedPostProps> = ({ txn }) => {
  const { currentAccount } = useAccountStore();

  const { cache } = useApolloClient();
  const txHash = txn?.txHash;
  const txId = txn?.txId;

  const [getPost] = usePublicationLazyQuery({
    onCompleted: ({ publication }) => {
      if (publication) {
        cache.modify({
          fields: {
            publications: () => {
              cache.writeQuery({
                data: publication,
                query: PublicationDocument
              });
            }
          }
        });
      }
    }
  });

  useLensTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ lensTransactionStatus }) => {
      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete &&
        txn.commentOn
      ) {
        await getPost({
          variables: { request: { forTxHash: lensTransactionStatus.txHash } }
        });
      }
    },
    pollInterval: 1000,
    variables: {
      request: {
        ...(txHash && { forTxHash: txHash }),
        ...(txId && { forTxId: txId })
      }
    }
  });

  if (!txn.content) {
    return null;
  }

  return (
    <Card as="article" className="p-5">
      <div className="flex items-start justify-between pb-4">
        <SmallSingleAccount linkToAccount account={currentAccount as Profile} />
        <Tooltip content="Indexing" placement="top">
          <div className="flex size-4 items-center justify-center rounded-full bg-gray-200">
            <div className="size-2 animate-shimmer rounded-full bg-gray-500" />
          </div>
        </Tooltip>
      </div>
      <div className="markup linkify break-words text-md">
        <Markup mentions={getMentions(txn.content)}>{txn.content}</Markup>
      </div>
    </Card>
  );
};

export default QueuedPost;
