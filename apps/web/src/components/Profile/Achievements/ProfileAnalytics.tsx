import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import { Card, ErrorMessage, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AnalyticsData {
  last_14_days: number;
  last_7_days: number;
}

interface StatProps {
  data?: AnalyticsData;
  title: string;
}

const Stat: FC<StatProps> = ({ data, title }) => {
  if (!data) {
    return null;
  }

  const { last_14_days, last_7_days } = data;

  const calculateChange = (): number => {
    const previous7Days = last_14_days - last_7_days;
    if (previous7Days === 0) {
      // To avoid division by zero, return 0 or indicate no previous data
      return 0;
    }
    return ((last_7_days - previous7Days) / previous7Days) * 100;
  };

  const percentageChange = calculateChange().toFixed(2);
  const notChanged = percentageChange === '0.00';
  const isUp = parseInt(percentageChange) > 0;
  const isDown = parseInt(percentageChange) < 0;

  return (
    <div>
      <div className="ld-text-gray-500">{title}</div>
      <div className="flex items-baseline space-x-2">
        <div className="text-3xl font-bold">{humanize(last_7_days)}</div>
        {!notChanged ? (
          <div
            className={cn(
              isUp && 'text-green-500',
              isDown && 'text-red-500',
              'text-sm font-bold'
            )}
          >
            {percentageChange}%
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface ProfileAnalyticsData {
  collects: AnalyticsData;
  comments: AnalyticsData;
  follows: AnalyticsData;
  impressions: AnalyticsData;
  likes: AnalyticsData;
  link_clicks: AnalyticsData;
  mirrors: AnalyticsData;
  profile_views: AnalyticsData;
}

interface ProfileAnalyticsProps {
  profile: Profile;
}

const ProfileAnalytics: FC<ProfileAnalyticsProps> = ({ profile }) => {
  const fetchProfileAnalytics =
    async (): Promise<null | ProfileAnalyticsData> => {
      try {
        const response = await axios.get(`${HEY_API_URL}/stats/profile`, {
          params: {
            handle: profile?.handle?.localName,
            id: profile?.id
          }
        });
        const { data } = response;

        return data.result;
      } catch {
        return null;
      }
    };

  const { data, error, isLoading } = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: fetchProfileAnalytics,
    queryKey: ['fetchProfileAnalytics']
  });

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="space-y-2 px-5 py-3.5 text-center font-bold">
          <Spinner className="mx-auto" size="md" />
          <div>Loading profile analytics</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <Card>
      <div className="flex items-center space-x-2 px-6 py-5 text-lg font-bold">
        <ChartBarSquareIcon className="text-brand-500 size-6" />
        <span>Profile Analytics</span>
      </div>
      <div className="divider" />
      <div className="m-6 grid grid-cols-2 gap-6">
        <Stat data={data?.impressions} title="Impressions" />
        <Stat data={data?.profile_views} title="Profile Views" />
        <Stat data={data?.follows} title="Follows" />
        <Stat data={data?.likes} title="Likes" />
        <Stat data={data?.comments} title="Comments" />
        <Stat data={data?.mirrors} title="Mirrors" />
        <Stat data={data?.link_clicks} title="Link clicks" />
        <Stat data={data?.collects} title="Collects" />
      </div>
      <div className="mx-6 mb-6 text-xs">Metrics shown for the last 7 days</div>
    </Card>
  );
};

export default ProfileAnalytics;
