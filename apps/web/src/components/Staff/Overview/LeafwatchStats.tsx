import type { FC } from 'react';

import {
  ExploreProfilesOrderByType,
  LimitType,
  useExploreProfilesQuery
} from '@hey/lens';
import { CardHeader, NumberedStat } from '@hey/ui';
import { useState } from 'react';

import Events from './Events';
import Impressions from './Impressions';

export interface StatsType {
  dau: {
    date: string;
    dau: string;
    events: string;
    impressions: string;
  }[];
  events: {
    all_time: string;
    last_1_hour: string;
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
    last_1_hour: string;
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
}

const LeafwatchStats: FC = () => {
  const [lensProfiles, setLensProfiles] = useState(0);

  useExploreProfilesQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) =>
      setLensProfiles(parseInt(data.exploreProfiles.items[0].id)),
    pollInterval: 5000,
    variables: {
      request: {
        limit: LimitType.Ten,
        orderBy: ExploreProfilesOrderByType.LatestCreated
      }
    }
  });

  return (
    <>
      <Events />
      <div className="divider" />
      <Impressions />
      <div>
        <div className="divider" />
        <CardHeader title="Others" />
        <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <NumberedStat count={lensProfiles.toString()} name="Total Profiles" />
        </div>
      </div>
      {/* <EventsToday eventsToday={data.eventsToday} />
      <ImpressionsToday impressionsToday={data.impressionsToday} />
      <ActiveUsers activeUsers={data.dau} />
      <Referrers referrers={data.referrers} /> */}
    </>
  );
};

export default LeafwatchStats;
