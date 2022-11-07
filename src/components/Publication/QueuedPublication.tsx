import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import UserProfile from '@components/Shared/UserProfile';
import { Tooltip } from '@components/UI/Tooltip';
import type { Profile } from '@generated/types';
import {
  HasTxHashBeenIndexedDocument,
  PublicationDocument,
  PublicationMetadataStatusType
} from '@generated/types';
import getURLs from '@lib/getURLs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

dayjs.extend(relativeTime);

interface Props {
  txn: any;
}

const QueuedPublication: FC<Props> = ({ txn }) => {
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

  const [getPublication] = useLazyQuery(PublicationDocument, {
    onCompleted: (data) => {
      if (data?.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: data?.publication as any,
                query: PublicationDocument
              });
            }
          }
        });
        removeTxn();
      }
    }
  });

  useQuery(HasTxHashBeenIndexedDocument, {
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
      <div className="pb-4 flex items-start justify-between">
        <UserProfile profile={currentProfile as Profile} />
        <Tooltip content="Indexing" placement="top">
          <div className="bg-brand-200 rounded-full h-4 w-4 flex items-center justify-center">
            <div className="animate-pulse bg-brand-500 rounded-full h-2 w-2" />
          </div>
        </Tooltip>
      </div>
      <div className="ml-[53px] break-words">
        <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
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
