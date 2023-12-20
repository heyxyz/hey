import type { AnyPublication, LatestActed, PaginatedRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PaidActionsShimmer from '@components/Shared/Shimmer/PaidActionsShimmer';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { LimitType, useLatestPaidActionsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';

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

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return <PaidActionsShimmer />;
  }

  if (actions?.length === 0) {
    return (
      <EmptyState
        icon={<CurrencyDollarIcon className="text-brand-500 size-8" />}
        message="No paid actions yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load paid actions" />;
  }

  return (
    <div className="space-y-5">
      {actions?.map((action, index) =>
        action.__typename === 'OpenActionPaidAction' ? (
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
            />
          </Card>
        ) : null
      )}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default PaidActions;
