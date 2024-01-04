import type { FC } from 'react';

import { EyeIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import plur from 'plur';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import Loader from '../Loader';

interface PublicationLocationStat {
  countryCode: string;
  location: string;
  views: number;
}

const Views: FC = () => {
  const statsPublicationId = useGlobalModalStateStore(
    (state) => state.statsPublicationId
  );

  const getViewsLocationStats = async (): Promise<
    null | PublicationLocationStat[]
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/stats/publication/location`,
        { params: { id: statsPublicationId } }
      );
      const { data } = response;

      return data.result;
    } catch {
      return null;
    }
  };

  const { data, error, isFetching } = useQuery({
    queryFn: () => getViewsLocationStats(),
    queryKey: ['getViewsLocationStats']
  });

  if (isFetching) {
    return <Loader message="Loading views" />;
  }

  if (data?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<EyeIcon className="text-brand-500 size-8" />}
          message="No views."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error as Error}
        title="Failed to load mirrors"
      />
    );
  }

  return (
    <div className="max-h-[80vh] divide-y overflow-y-auto">
      {data?.map((stat) => (
        <div
          className="flex items-start justify-between px-5 py-3 text-sm"
          key={stat.countryCode}
        >
          <div className="flex items-center space-x-2">
            <img
              className="h-4"
              src={`https://assets.simpleanalytics.com/images/flags/${stat.countryCode}.svg`}
            />
            <div>{stat.location}</div>
          </div>
          <div>
            <span className="font-bold">{stat.views} </span>
            <span className="ld-text-gray-500">{plur('View', stat.views)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Views;
