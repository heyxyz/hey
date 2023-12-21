import type { ProfileActionHistoryRequest } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { QueueListIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import { LimitType, useProfileActionHistoryQuery } from '@hey/lens';
import formatDate from '@hey/lib/datetime/formatDate';
import formatAddress from '@hey/lib/formatAddress';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { useInView } from 'react-cool-inview';
import useProfileStore from 'src/store/persisted/useProfileStore';

const List: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const request: ProfileActionHistoryRequest = { limit: LimitType.TwentyFive };
  const { data, error, fetchMore, loading } = useProfileActionHistoryQuery({
    skip: !currentProfile?.id,
    variables: { request }
  });

  const profileActionHistory = data?.profileActionHistory?.items;
  const pageInfo = data?.profileActionHistory?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      return await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="pb-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load profile actions" />
    );
  }

  if (profileActionHistory?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<QueueListIcon className="text-brand-500 size-8" />}
        message="You have no actions on your account!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {profileActionHistory?.map((action) => (
        <Card className="space-y-1 p-5" forceRounded key={action.id}>
          <b>{action.actionType.toLowerCase()}</b>
          <div className="ld-text-gray-500 text-sm">
            {action.txHash ? (
              <span>
                <span>Hash: </span>
                <Link
                  className="hover:underline"
                  href={`${POLYGONSCAN_URL}/tx/${action.txHash}`}
                >
                  {action.txHash.slice(0, 8 + 2)}…
                  {action.txHash.slice(action.txHash.length - 8)}
                </Link>
                <span className="mx-2 border-l dark:border-gray-700" />
              </span>
            ) : null}
            {action.who ? (
              <span>
                <span>Acted by: </span>
                <Link
                  className="hover:underline"
                  href={`${POLYGONSCAN_URL}/address/${action.who}`}
                >
                  {formatAddress(action.who)}
                </Link>
                <span className="mx-2 border-l dark:border-gray-700" />
              </span>
            ) : null}
            {formatDate(action.actionedOn, 'MMM D, YYYY - hh:mm:ss A')}
          </div>
        </Card>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
