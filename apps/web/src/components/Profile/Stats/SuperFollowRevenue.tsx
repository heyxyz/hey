import type { FollowRevenueRequest } from '@hey/lens';

import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { useFollowRevenuesQuery } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import humanize from '@hey/lib/humanize';
import { Card, CardHeader, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';

interface SuperFollowRevenueProps {
  profileId: string;
}

const SuperFollowRevenue: FC<SuperFollowRevenueProps> = ({ profileId }) => {
  const request: FollowRevenueRequest = { for: profileId };

  const { data, error, loading } = useFollowRevenuesQuery({
    skip: !profileId,
    variables: { request }
  });

  const {
    data: allowedTokens,
    error: allowedTokensError,
    isLoading: allowedTokensLoading
  } = useQuery({
    queryFn: getAllTokens,
    queryKey: ['getAllTokens']
  });

  if (loading || allowedTokensLoading) {
    return <PublicationsShimmer />;
  }

  if (data?.followRevenues.revenues.length === 0) {
    return null;
  }

  if (error || allowedTokensError) {
    return <ErrorMessage error={error} title="Failed to load profile stats" />;
  }

  const tokensAvailable = allowedTokens?.map((token) => token.symbol);

  return (
    <Card>
      <CardHeader title="Super follow revenue" />
      <div className="p-5">
        {data?.followRevenues.revenues.map((revenue, index) => (
          <div className="flex items-center space-x-2" key={index}>
            {tokensAvailable?.includes(revenue.total.asset.symbol) ? (
              <img
                alt={revenue.total.asset.symbol}
                className="size-5"
                src={`${STATIC_IMAGES_URL}/tokens/${revenue.total.asset.symbol}.svg`}
              />
            ) : (
              <CurrencyDollarIcon className="size-5" />
            )}
            <div className="text-lg font-bold">{revenue.total.asset.name}</div>
            <div className="text-sm">
              {humanize(parseFloat(revenue.total.value))}{' '}
              {revenue.total.asset.symbol}
            </div>
            <div className="text-sm">(${revenue.total.asFiat?.value})</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SuperFollowRevenue;
