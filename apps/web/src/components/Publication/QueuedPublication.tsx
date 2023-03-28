import { useApolloClient } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import UserProfile from '@components/Shared/UserProfile';
import { t } from '@lingui/macro';
import type { Profile } from 'lens';
import {
  PublicationDocument,
  PublicationMetadataStatusType,
  useHasTxHashBeenIndexedQuery,
  usePublicationLazyQuery
} from 'lens';
import getURLs from 'lib/getURLs';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';
import type { OptimisticTransaction } from 'src/types';
import { Tooltip } from 'ui';

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
    if (txHash) {
      setTxnQueue(txnQueue.filter((o) => o.txHash !== txHash));
    } else {
      setTxnQueue(txnQueue.filter((o) => o.txId !== txId));
    }
  };

  const [getPublication] = usePublicationLazyQuery({
    onCompleted: (data) => {
      if (data?.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({ data: { publication: data?.publication }, query: PublicationDocument });
            }
          }
        });
        removeTxn();
      }
    }
  });

  useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash, txId } },
    pollInterval: 1000,
    onCompleted: (data) => {
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
        return removeTxn();
      }

      if (data.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult') {
        const status = data.hasTxHashBeenIndexed.metadataStatus?.status;

        if (
          status === PublicationMetadataStatusType.MetadataValidationFailed ||
          status === PublicationMetadataStatusType.NotFound
        ) {
          return removeTxn();
        }

        if (data.hasTxHashBeenIndexed.indexed) {
          getPublication({
            variables: {
              request: { txHash: data.hasTxHashBeenIndexed.txHash },
              reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
              profileId: currentProfile?.id ?? null
            }
          });
        }
      }
    }
  });

  return (
    <article className="p-5">
      <div className="flex items-start justify-between pb-4">
        <UserProfile profile={currentProfile as Profile} />
        <Tooltip content={t`Indexing`} placement="top">
          <div className="bg-brand-200 flex h-4 w-4 items-center justify-center rounded-full">
            <div className="bg-brand-500 h-2 w-2 animate-pulse rounded-full" />
          </div>
        </Tooltip>
      </div>
      <div className="ml-[53px]">
        <div className="markup linkify text-md break-words">
          <Markup>{txn?.content}</Markup>
        </div>
        {txn?.attachments?.length > 0 ? (
          <Attachments attachments={txn?.attachments} txn={txn} isNew hideDelete />
        ) : (
          txn?.attachments && getURLs(txn?.content)?.length > 0 && <IFramely url={getURLs(txn?.content)[0]} />
        )}
      </div>
    </article>
  );
};

export default QueuedPublication;
