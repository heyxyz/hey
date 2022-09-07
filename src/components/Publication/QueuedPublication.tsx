import { useQuery } from '@apollo/client';
import Markup from '@components/Shared/Markup';
import UserProfile from '@components/Shared/UserProfile';
import { Profile } from '@generated/types';
import { TX_STATUS_QUERY } from '@gql/HasTxHashBeenIndexed';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationPersistStore } from 'src/store/publication';

dayjs.extend(relativeTime);

interface Props {
  txn: any;
}

const QueuedPublication: FC<Props> = ({ txn }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = usePublicationPersistStore((state) => state.txnQueue);
  const setTxnQueue = usePublicationPersistStore((state) => state.setTxnQueue);

  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash: txn?.txnHash }
    },
    pollInterval: 1000,
    onCompleted: (data) => {
      if (data?.hasTxHashBeenIndexed?.indexed) {
        console.log('tx indexed');
        // remove from queue
        setTxnQueue(txnQueue.filter((o) => o.txnHash !== txn?.txnHash));
      }
    }
  });

  return (
    <article className="p-5">
      <div className="pb-4">
        <UserProfile profile={currentProfile as Profile} />
      </div>
      <div className="ml-[53px] break-words">
        <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
          <Markup>{txn?.content}</Markup>
        </div>
      </div>
    </article>
  );
};

export default QueuedPublication;
