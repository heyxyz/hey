import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@hey/data/constants';
import { ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import NumberedStat from '../UI/NumberedStat';
import EventsToday from './EventsToday';
import ImpressionsToday from './ImpressionsToday';

export interface StatsType {
  events: {
    all_time: string;
    last_60_seconds: string;
    this_month: string;
    this_week: string;
    today: string;
    yesterday: string;
  };
  eventsToday: {
    count: string;
    timestamp: string;
  }[];
  impressions: {
    all_time: string;
    last_60_seconds: string;
    this_month: string;
    this_week: string;
    today: string;
    yesterday: string;
  };
  impressionsToday: {
    count: string;
    timestamp: string;
  }[];
  topEvents: {
    count: string;
    name: string;
  }[];
}

const LeafwatchStats: FC = () => {
  const getStats = async (): Promise<StatsType> => {
    const response: {
      data: StatsType;
    } = await axios.get(`${HEY_API_URL}/internal/leafwatch/stats`);

    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getStats,
    queryKey: ['getStats'],
    refetchInterval: 1000
  });

  if (isLoading) {
    return (
      <div className="m-5">
        <Loader message="Loading stats..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load stats" />;
  }

  if (!data) {
    return <div className="m-5">No data...</div>;
  }

  const { events, impressions } = data;

  return (
    <div>
      <div>
        <div className="p-5 text-lg font-bold">Events</div>
        <div className="divider" />
        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
          <NumberedStat count={events.last_60_seconds} name="Last 60 seconds" />
          <NumberedStat count={events.today} name="Today" />
          <NumberedStat count={events.yesterday} name="Yesterday" />
          <NumberedStat count={events.this_week} name="This week" />
          <NumberedStat count={events.this_month} name="This month" />
          <NumberedStat count={events.all_time} name="All time" />
        </div>
      </div>
      <div>
        <div className="divider" />
        <div className="p-5 text-lg font-bold">Impressions</div>
        <div className="divider" />
        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
          <NumberedStat
            count={impressions.last_60_seconds}
            name="Last 60 seconds"
          />
          <NumberedStat count={impressions.today} name="Today" />
          <NumberedStat count={impressions.yesterday} name="Yesterday" />
          <NumberedStat count={impressions.this_week} name="This week" />
          <NumberedStat count={impressions.this_month} name="This month" />
          <NumberedStat count={impressions.all_time} name="All time" />
        </div>
      </div>
      <EventsToday eventsToday={data.eventsToday} />
      <ImpressionsToday impressionsToday={data.impressionsToday} />
    </div>
  );
};

export default LeafwatchStats;
