import type { AnyPublication, LatestActed, PaginatedRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PaidActionsShimmer from '@components/Shared/Shimmer/PaidActionsShimmer';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { LimitType, useLatestPaidActionsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';

import OpenActionPaidAction from './OpenActionPaidAction';

const PaidActions: FC = () => {
  // Variables
  const request: PaginatedRequest = {
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useLatestPaidActionsQuery({
    variables: { request }
  });

  const actions = data?.latestPaidActions?.items;
  const pageInfo = data?.latestPaidActions?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <PaidActionsShimmer />;
  }

  if (actions?.length === 0) {
    return (
      <EmptyState
        icon={<CurrencyDollarIcon className="size-8" />}
        message="No paid actions yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load paid actions" />;
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-5"
      components={{ Footer: () => <div className="pb-5" /> }}
      data={actions}
      endReached={onEndReached}
      itemContent={(index, action) => {
        return action.__typename === 'OpenActionPaidAction' ? (
          <Card key={`${action.actedOn?.id}_${index}`}>
            <OpenActionPaidAction
              latestActed={action.latestActed as LatestActed[]}
              publication={action.actedOn as AnyPublication}
            />
            <div className="divider" />
            <SinglePublication
              isFirst={false}
              isLast
              publication={action.actedOn as AnyPublication}
              showThread={false}
            />
          </Card>
        ) : null;
      }}
      useWindowScroll
    />
  );
};

export default PaidActions;
