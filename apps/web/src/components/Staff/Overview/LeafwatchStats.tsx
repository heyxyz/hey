import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@hey/data/constants';
import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery
} from '@hey/lens';
import { CardHeader, ErrorMessage, NumberedStat } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import ActiveUsers from './ActiveUsers';
import EventsToday from './EventsToday';
import ImpressionsToday from './ImpressionsToday';
import Referrers from './Referrers';

export interface StatsType {
  dau: {
    date: string;
    dau: string;
    events: string;
    impressions: string;
  }[];
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
  referrers: {
    count: string;
    referrer: string;
  }[];
  topEvents: {
    count: string;
    name: string;
  }[];
}

const LeafwatchStats: FC = () => {
  const [lensProfiles, setLensProfiles] = useState(0);

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

  const getScoreVolume = async (): Promise<{
    cached: number;
    volume: number;
  }> => {
    const response = await axios.get(`${HEY_API_URL}/internal/score/volume`);

    return response.data;
  };

  const { data: scoreVolumeData } = useQuery({
    queryFn: getScoreVolume,
    queryKey: ['getScoreVolume'],
    refetchInterval: 1000
  });

  useExploreProfilesQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) =>
      setLensProfiles(parseInt(data.exploreProfiles.items[0].id)),
    pollInterval: 1000,
    variables: {
      request: {
        limit: LimitType.Ten,
        orderBy: ExploreProfilesOrderByType.LatestCreated
      }
    }
  });

  if (isLoading) {
    return <Loader className="my-10" message="Loading stats..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load stats" />;
  }

  if (!data) {
    return <div className="m-5">No data...</div>;
  }

  const { events, impressions } = data;

  return (
    <>
      <div>
        <CardHeader title="Events" />
        <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
        <CardHeader title="Impressions" />
        <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
      <div>
        <div className="divider" />
        <CardHeader title="Others" />
        <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <NumberedStat count={lensProfiles.toString()} name="Total Profiles" />
          <NumberedStat
            count={scoreVolumeData?.volume.toString() || '0'}
            name="Score Volume"
          />
          <NumberedStat
            count={scoreVolumeData?.cached.toString() || '0'}
            name="Score cached for"
            suffix="profiles"
          />
        </div>
      </div>
      <EventsToday eventsToday={data.eventsToday} />
      <ImpressionsToday impressionsToday={data.impressionsToday} />
      <ActiveUsers activeUsers={data.dau} />
      <Referrers referrers={data.referrers} />
    </>
  );
};

export default LeafwatchStats;
