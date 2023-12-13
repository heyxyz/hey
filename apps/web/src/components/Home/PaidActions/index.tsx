import type { AnyPublication, PaginatedRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
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
    return <PublicationsShimmer />;
  }

  if (actions?.length === 0) {
    return (
      <EmptyState
        icon={<CurrencyDollarIcon className="text-brand-500 h-8 w-8" />}
        message="No paid actions yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load paid actions" />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {actions?.map((action, index) =>
        action.__typename === 'OpenActionPaidAction' ? (
          <div key={`${action.actedOn?.id}_${index}`}>
            <OpenActionPaidAction />
            <div className="divider" />
            <SinglePublication
              isFirst={index === 0}
              isLast={index === actions.length - 1}
              publication={action.actedOn as AnyPublication}
            />
          </div>
        ) : null
      )}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default PaidActions;
