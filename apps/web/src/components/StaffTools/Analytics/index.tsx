import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import humanize from '@lib/humanize';
import axios from 'axios';
import { APP_NAME, ERROR_MESSAGE } from 'data/constants';
import type { NextPage } from 'next';
import type { FC, ReactNode } from 'react';
import { useQuery } from 'react-query';
import Custom404 from 'src/pages/404';

import StaffToolsSidebar from '../Sidebar';

interface StatBoxProps {
  icon: ReactNode;
  value: number;
  title: string;
}

const StatBox: FC<StatBoxProps> = ({ icon, value, title }) => (
  <Card className="px-7 py-4 w-full" forceRounded>
    <div className="flex items-center space-x-2">
      {icon}
      <b className="text-lg">{humanize(value)}</b>
    </div>
    <div className="lt-text-gray-500">{title}</div>
  </Card>
);

const Analytics: NextPage = () => {
  const { allowed } = useStaffMode();

  const { isLoading, error, data } = useQuery('repoData', () =>
    axios({
      url: 'https://simpleanalytics.com/lenster.xyz.json',
      params: {
        version: 5,
        fields: 'pageviews',
        info: false
      }
    }).then((res) => res.data)
  );

  if (!allowed) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Stafftools • ${APP_NAME}`} />
      <GridItemFour>
        <StaffToolsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">
          {error ? (
            <b className="text-red-500">{ERROR_MESSAGE}</b>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            <section className="space-y-3">
              <h1 className="text-xl font-bold mb-4">Analytics</h1>
              <div className="block sm:flex space-y-3 sm:space-y-0 sm:space-x-3 justify-between">
                {JSON.stringify(data)}
              </div>
            </section>
          )}
          <div />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Analytics;
