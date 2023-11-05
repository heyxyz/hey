import Markup from '@components/Shared/Markup';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import type { Profile } from '@hey/lens';
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import getMentions from '@hey/lib/getMentions';
import type { OptimisticTransaction } from '@hey/types/misc';
import { Card, Tooltip } from '@hey/ui';
import { type FC, memo } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

interface QueuedPublicationProps {
  txn: OptimisticTransaction;
}

const QueuedPublication: FC<QueuedPublicationProps> = ({ txn }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

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
    variables: {
      request: {
        ...(txHash && { forTxHash: txHash }),
        ...(txId && { forTxId: txId })
      }
    },
    pollInterval: 1000,
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
    }
  });

  return (
    <Card as="article" className="p-5">
      <div className="flex items-start justify-between pb-4">
        <SmallUserProfile profile={currentProfile as Profile} linkToProfile />
        <Tooltip content="Indexing" placement="top">
          <div className="bg-brand-200 flex h-4 w-4 items-center justify-center rounded-full">
            <div className="bg-brand-500 h-2 w-2 animate-pulse rounded-full" />
          </div>
        </Tooltip>
      </div>
      <div className="markup linkify text-md break-words">
        <Markup mentions={getMentions(txn.content)}>{txn.content}</Markup>
      </div>
    </Card>
  );
};

export default memo(QueuedPublication);
