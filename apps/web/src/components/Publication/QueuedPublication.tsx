import Markup from '@components/Shared/Markup';
import NewAttachments from '@components/Shared/NewAttachments';
import Oembed from '@components/Shared/Oembed';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@lenster/lens';
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery
} from '@lenster/lens';
import { useApolloClient } from '@lenster/lens/apollo';
import getURLs from '@lenster/lib/getURLs';
import removeUrlAtEnd from '@lenster/lib/removeUrlAtEnd';
import type { OptimisticTransaction } from '@lenster/types/misc';
import { Tooltip } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

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
  const [content, setContent] = useState(txn.content);
  const urls = getURLs(content);

  const onData = () => {
    const updatedContent = removeUrlAtEnd(urls, content);
    if (updatedContent !== content) {
      setContent(updatedContent);
    }
  };

  const removeTxn = () => {
    if (txHash) {
      setTxnQueue(txnQueue.filter((o) => o.txHash !== txHash));
    } else {
      setTxnQueue(txnQueue.filter((o) => o.txId !== txId));
    }
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
        removeTxn();
      }
    }
  });

  useLensTransactionStatusQuery({
    variables: { request: { forTxHash: txHash, forTxId: txId } },
    pollInterval: 1000,
    onCompleted: ({ lensTransactionStatus }) => {
      if (lensTransactionStatus?.status === LensTransactionStatusType.Failed) {
        return removeTxn();
      }

      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        getPublication({
          variables: {
            request: { forTxHash: lensTransactionStatus?.txHash }
          }
        });
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
          <Markup>{content}</Markup>
        </div>
        {txn?.attachments?.length > 0 ? (
          <NewAttachments attachments={txn?.attachments} txn={txn} hideDelete />
        ) : txn?.attachments && urls.length > 0 ? (
          <Oembed url={urls[0]} onData={onData} />
        ) : null}
      </div>
    </article>
  );
};

export default QueuedPublication;
