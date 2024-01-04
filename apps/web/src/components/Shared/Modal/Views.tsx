import type { FC } from 'react';

import { EyeIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import Loader from '../Loader';

interface PublicationLocationStat {
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
    <div className="m-5 max-h-[80vh] overflow-y-auto">
      {JSON.stringify(data)}
    </div>
  );
};

export default Views;
