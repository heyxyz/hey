import type { Profile } from '@hey/lens';
import type { OptimisticTransaction } from '@hey/types/misc';
import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import getMentions from '@hey/lib/getMentions';
import { Card, Tooltip } from '@hey/ui';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface QueuedPublicationProps {
  txn: OptimisticTransaction;
}

const QueuedPublication: FC<QueuedPublicationProps> = ({ txn }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionStore((state) => state.setTxnQueue);

  const { cache } = useApolloClient();
  const txHash = txn?.txHash;
  const txId = txn?.txId;

  const removeTxn = () => {
    setTxnQueue(
      txnQueue.filter((o) => (txHash ? o.txHash !== txHash : o.txId !== txId))
    );
  };

  const [getPublication] = usePublicationLazyQuery({
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
      if (lensTransactionStatus?.status === LensTransactionStatusType.Failed) {
        return removeTxn();
      }

      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        if (txn.commentOn) {
          await getPublication({
            variables: { request: { forTxHash: lensTransactionStatus.txHash } }
          });
        }
        removeTxn();
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

  return (
    <Card as="article" className="p-5">
      <div className="flex items-start justify-between pb-4">
        <SmallUserProfile linkToProfile profile={currentProfile as Profile} />
        <Tooltip content="Indexing" placement="top">
          <div className="bg-brand-200 flex size-4 items-center justify-center rounded-full">
            <div className="bg-brand-500 size-2 animate-pulse rounded-full" />
          </div>
        </Tooltip>
      </div>
      <div className="markup linkify text-md break-words">
        <Markup mentions={getMentions(txn.content)}>{txn.content}</Markup>
      </div>
    </Card>
  );
};

export default QueuedPublication;
