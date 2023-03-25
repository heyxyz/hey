import MetaTags from '@components/Common/MetaTags';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatAlt2Icon,
  CollectionIcon,
  FireIcon,
  SwitchHorizontalIcon,
  UserAddIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { PencilAltIcon } from '@heroicons/react/solid';
import { getTimeAddedNDayUnix, getTimeMinusNDayUnix } from '@lib/formatTime';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { APP_NAME, ERROR_MESSAGE } from 'data/constants';
import { useLensterStatsQuery } from 'lens';
import type { NextPage } from 'next';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';
import humanize from 'utils/humanize';

import StaffToolsSidebar from '../Sidebar';

interface StatBoxProps {
  icon: ReactNode;
  value: number;
  todayValue: number;
  differenceValue: number;
  title: string;
}

export const StatBox: FC<StatBoxProps> = ({ icon, value, todayValue, differenceValue, title }) => (
  <Card className="w-full px-7 py-4" forceRounded>
    <div className="lt-text-gray-500">{title}</div>
    <div className="flex items-center space-x-2.5">
      {icon}
      <div>
        <div className="text-lg font-bold">{humanize(value)}</div>
        <div className="flex items-center space-x-1 text-xs">
          {differenceValue === 0 ? (
            <SwitchHorizontalIcon className="h-3 w-3 text-yellow-500" />
          ) : differenceValue <= 0 ? (
            <ArrowDownIcon className="h-3 w-3 text-red-500" />
          ) : (
            <ArrowUpIcon className="h-3 w-3 text-green-500" />
          )}
          <span
            className={clsx(
              differenceValue === 0
                ? 'text-yellow-500'
                : differenceValue <= 0
                ? 'text-red-500'
                : 'text-green-500'
            )}
          >
            <b>{humanize(todayValue)} today</b> (
            {differenceValue === 0 ? '' : differenceValue <= 0 ? '-' : '+'}
            {humanize(differenceValue).replace('-', '')})
          </span>
        </div>
      </div>
    </div>
  </Card>
);

const Stats: NextPage = () => {
  const { allowed } = useStaffMode();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'stafftools', subpage: 'stats' });
  }, []);

  const { data, loading, error } = useLensterStatsQuery({
    variables: { request: { sources: [APP_NAME] } }
  });

  const { data: todayData, loading: todayLoading } = useLensterStatsQuery({
    variables: {
      request: {
        sources: [APP_NAME],
        fromTimestamp: getTimeMinusNDayUnix(1),
        toTimestamp: getTimeAddedNDayUnix(1)
      }
    }
  });

  const { data: yesterdayData, loading: yesterdayLoading } = useLensterStatsQuery({
    variables: {
      request: {
        sources: [APP_NAME],
        fromTimestamp: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2,
        toTimestamp: Math.floor(Date.now() / 1000) - 60 * 60 * 24
      }
    }
  });

  if (!allowed) {
    return <Custom404 />;
  }

  const stats: any = data?.globalProtocolStats;
  const yesterdayStats: any = yesterdayData?.globalProtocolStats;
  const todayStats: any = todayData?.globalProtocolStats;

  return (
    <GridLayout>
      <MetaTags title={t`Stafftools • ${APP_NAME}`} />
      <GridItemFour>
        <StaffToolsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">
          {error ? (
            <b className="text-red-500">{ERROR_MESSAGE}</b>
          ) : loading || todayLoading || yesterdayLoading ? (
            <div>Loading...</div>
          ) : (
            <section className="space-y-3">
              <h1 className="mb-4 text-xl font-bold">Stats</h1>
              <div className="block justify-between space-y-3 sm:flex sm:space-y-0 sm:space-x-3">
                <StatBox
                  icon={<UsersIcon className="h-6 w-6" />}
                  value={stats?.totalProfiles}
                  todayValue={todayStats?.totalProfiles}
                  differenceValue={yesterdayStats?.totalProfiles - todayStats?.totalProfiles}
                  title="total profiles"
                />
                <StatBox
                  icon={<FireIcon className="h-6 w-6" />}
                  value={stats?.totalBurntProfiles}
                  todayValue={todayStats?.totalBurntProfiles}
                  differenceValue={yesterdayStats?.totalBurntProfiles - todayStats?.totalBurntProfiles}
                  title="profiles burnt"
                />
                <StatBox
                  icon={<PencilAltIcon className="h-6 w-6" />}
                  value={stats?.totalPosts}
                  todayValue={todayStats?.totalPosts}
                  differenceValue={yesterdayStats?.totalPosts - todayStats?.totalPosts}
                  title="total posts"
                />
              </div>
              <div className="block justify-between space-y-3 sm:flex sm:space-y-0 sm:space-x-3">
                <StatBox
                  icon={<SwitchHorizontalIcon className="h-6 w-6" />}
                  value={stats?.totalMirrors}
                  todayValue={todayStats?.totalMirrors}
                  differenceValue={yesterdayStats?.totalMirrors - todayStats?.totalMirrors}
                  title="total mirrors"
                />
                <StatBox
                  icon={<ChatAlt2Icon className="h-6 w-6" />}
                  value={stats?.totalComments}
                  todayValue={todayStats?.totalComments}
                  differenceValue={yesterdayStats?.totalComments - todayStats?.totalComments}
                  title="total comments"
                />
              </div>
              <div className="block justify-between space-y-3 sm:flex sm:space-y-0 sm:space-x-3">
                <StatBox
                  icon={<CollectionIcon className="h-6 w-6" />}
                  value={stats?.totalCollects}
                  todayValue={todayStats?.totalCollects}
                  differenceValue={yesterdayStats?.totalCollects - todayStats?.totalCollects}
                  title="total collects"
                />
                <StatBox
                  icon={<UserAddIcon className="h-6 w-6" />}
                  value={stats?.totalFollows}
                  todayValue={todayStats?.totalFollows}
                  differenceValue={yesterdayStats?.totalFollows - todayStats?.totalFollows}
                  title="total follows"
                />
              </div>
            </section>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Stats;
