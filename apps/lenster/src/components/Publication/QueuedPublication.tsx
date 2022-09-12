import { useApolloClient, useQuery } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import UserProfile from '@components/Shared/UserProfile';
import { Tooltip } from '@components/UI/Tooltip';
import { Profile } from '@generated/types';
import getURLs from '@lib/getURLs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FC } from 'react';
import { POLYGONSCAN_URL } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { usePublicationPersistStore } from 'src/store/publication';

import { PUBLICATION_QUERY } from '.';

dayjs.extend(relativeTime);

interface Props {
  txn: any;
}

const QueuedPublication: FC<Props> = ({ txn }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = usePublicationPersistStore((state) => state.txnQueue);
  const setTxnQueue = usePublicationPersistStore((state) => state.setTxnQueue);
  const { cache } = useApolloClient();
  const txHash = txn?.txHash;

  useQuery(PUBLICATION_QUERY, {
    variables: {
      request: { txHash },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    pollInterval: 1000,
    onCompleted: (data) => {
      if (data?.publication) {
        setTxnQueue(txnQueue.filter((o) => o.txHash !== txHash));
        cache.modify({
          fields: {
            [txn?.type === 'NEW_POST' ? 'timeline' : 'publications']() {
              cache.writeQuery({
                data: data?.publication,
                query: PUBLICATION_QUERY
              });
            }
          }
        });
      }
    }
  });

  return (
    <article className="p-5">
      <div className="pb-4 flex items-start justify-between">
        <UserProfile profile={currentProfile as Profile} />
        <Tooltip content="Indexing" placement="top">
          <a
            className="bg-brand-200 rounded-full h-4 w-4 flex items-center justify-center"
            href={`${POLYGONSCAN_URL}/tx/${txHash}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="animate-pulse bg-brand-500 rounded-full h-2 w-2" />
          </a>
        </Tooltip>
      </div>
      <div className="ml-[53px] break-words">
        <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
          <Markup>{txn?.content}</Markup>
        </div>
        {txn?.attachments?.length > 0 ? (
          <Attachments attachments={txn?.attachments} isNew hideDelete />
        ) : (
          txn?.attachments && getURLs(txn?.content)?.length > 0 && <IFramely url={getURLs(txn?.content)[0]} />
        )}
      </div>
    </article>
  );
};

export default QueuedPublication;
