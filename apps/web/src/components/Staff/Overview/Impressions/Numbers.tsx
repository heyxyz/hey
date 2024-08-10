import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import { HEY_API_URL } from '@hey/data/constants';
import { CardHeader, ErrorMessage, NumberedStat } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface StatsType {
  allTime: string;
  lastHour: string;
  thisMonth: string;
  thisWeek: string;
  today: string;
  yesterday: string;
}

const Numbers: FC = () => {
  const getImpressionsNumberStats = async (): Promise<StatsType> => {
    const response: {
      data: StatsType;
    } = await axios.get(`${HEY_API_URL}/internal/leafwatch/stats/impressions`, {
      headers: getAuthApiHeaders()
    });

    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getImpressionsNumberStats,
    queryKey: ['getImpressionsNumberStats'],
    refetchInterval: 5000
  });

  if (isLoading) {
    return <Loader className="my-10" message="Loading impressions stats..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load impressions stats"
      />
    );
  }

  if (!data) {
    return <div className="m-5">No impressions stats found.</div>;
  }

  return (
    <div>
      <CardHeader title="Impressions" />
      <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <NumberedStat count={data.lastHour} name="Last 1 hour" />
        <NumberedStat count={data.today} name="Today" />
        <NumberedStat count={data.yesterday} name="Yesterday" />
        <NumberedStat count={data.thisWeek} name="This week" />
        <NumberedStat count={data.thisMonth} name="This month" />
        <NumberedStat count={data.allTime} name="All time" />
      </div>
    </div>
  );
};

export default Numbers;
