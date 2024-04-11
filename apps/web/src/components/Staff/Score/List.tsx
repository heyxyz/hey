import type { FC } from 'react';
import type { Address } from 'viem';

import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';
import Loader from '@components/Shared/Loader';
import { UsersIcon } from '@heroicons/react/24/outline';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import { Card, CardHeader, EmptyState, ErrorMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Virtuoso } from 'react-virtuoso';

const List: FC = () => {
  const getLeaderboard = async (): Promise<
    { address: Address; amount: number }[] | null
  > => {
    try {
      const response = await axios.get(`${HEY_API_URL}/score/leaderboard`, {
        headers: await getAuthApiHeaders()
      });

      return response.data.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getLeaderboard,
    queryKey: ['getLeaderboard']
  });

  return (
    <Card>
      <CardHeader title={`${APP_NAME} Score`} />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-5" message="Loading profiles..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load profiles" />
        ) : !data?.length ? (
          <EmptyState
            hideCard
            icon={<UsersIcon className="size-8" />}
            message={<span>No profiles</span>}
          />
        ) : (
          <Virtuoso
            computeItemKey={(index, score) => `${score.address}-${index}`}
            data={data}
            itemContent={(index, score) => {
              return (
                <div
                  className={cn(
                    index !== 0 && 'pt-5',
                    'flex flex-wrap items-center justify-between gap-y-5'
                  )}
                >
                  <LazyDefaultProfile address={score.address} />
                  <b className="text-sm">{humanize(score.amount)}</b>
                </div>
              );
            }}
            useWindowScroll
          />
        )}
      </div>
    </Card>
  );
};

export default List;
