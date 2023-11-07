import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { STATS_WORKER_URL } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import humanize from '@hey/lib/humanize';
import { Card, ErrorMessage, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

interface AnalyticsData {
  last_7_days: number;
  last_14_days: number;
}

interface StatProps {
  title: string;
  data?: AnalyticsData;
}

const Stat: FC<StatProps> = ({ title, data }) => {
  if (!data) {
    return null;
  }

  const { last_7_days, last_14_days } = data;

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
  likes: AnalyticsData;
  mirrors: AnalyticsData;
  impressions: AnalyticsData;
  follows: AnalyticsData;
  profile_views: AnalyticsData;
  comments: AnalyticsData;
  link_clicks: AnalyticsData;
}

const ProfileAnalytics: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'analytics' });
  });

  const fetchProfileAnalytics =
    async (): Promise<ProfileAnalyticsData | null> => {
      try {
        const response = await axios.get(`${STATS_WORKER_URL}/profile`, {
          params: {
            id: currentProfile?.id,
            handle: currentProfile?.handle?.localName
          }
        });
        const { data } = response;

        return data.result;
      } catch {
        return null;
      }
    };

  const { data, isLoading, error } = useQuery({
    queryKey: ['fetchProfileAnalytics'],
    queryFn: fetchProfileAnalytics,
    enabled: Boolean(currentProfile?.id)
  });

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="space-y-2 px-5 py-3.5 text-center font-bold">
          <Spinner size="md" className="mx-auto" />
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
      <div className="m-5 flex items-center space-x-2">
        <ChartBarSquareIcon className="text-brand-500 h-6 w-6" />
        <div className="text-lg font-bold">Profile Analytics</div>
      </div>
      <div className="divider" />
      <div className="m-5 grid grid-cols-2 gap-6">
        <Stat title="Impressions" data={data?.impressions} />
        <Stat title="Profile Views" data={data?.profile_views} />
        <Stat title="Follows" data={data?.follows} />
        <Stat title="Likes" data={data?.likes} />
        <Stat title="Comments" data={data?.comments} />
        <Stat title="Mirrors" data={data?.mirrors} />
        <Stat title="Link clicks" data={data?.link_clicks} />
      </div>
    </Card>
  );
};

export default ProfileAnalytics;
