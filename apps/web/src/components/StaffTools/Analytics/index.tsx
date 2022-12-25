import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { EyeIcon, UsersIcon, ViewListIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { APP_NAME, ERROR_MESSAGE } from 'data/constants';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { SIMPLEANALYTICS_API_ENDPOINT } from 'src/constants';
import Custom404 from 'src/pages/404';

import StaffToolsSidebar from '../Sidebar';
import { StatBox } from '../Stats';

const Analytics: NextPage = () => {
  const { allowed } = useStaffMode();
  const [start, setStart] = useState('today');

  const { isLoading, error, data } = useQuery(
    'analyticsData',
    () =>
      axios({
        url: SIMPLEANALYTICS_API_ENDPOINT,
        params: {
          version: 5,
          fields: 'pageviews,visitors',
          start,
          events: '*',
          info: false
        }
      }).then((res) => res.data),
    {
      refetchInterval: 1000
    }
  );

  if (!allowed) {
    return <Custom404 />;
  }

  const countEvents = (events: any) => {
    let total = 0;
    for (const event of events) {
      total += event.total;
    }

    return total;
  };

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
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Analytics</h1>
                <select
                  className="text-sm py-1"
                  onChange={(event) => {
                    setStart(event.target.value);
                  }}
                >
                  <option defaultChecked value="today">
                    Today
                  </option>
                  <option value="yesterday">Yesterday</option>
                  <option value="2021-11-01">All time</option>
                </select>
              </div>
              <div className="block sm:flex space-y-3 sm:space-y-0 sm:space-x-3 justify-between">
                <StatBox
                  icon={<UsersIcon className="w-4 h-4" />}
                  value={data?.visitors}
                  title="unique visitors"
                />
                <StatBox icon={<EyeIcon className="w-4 h-4" />} value={data?.pageviews} title="pageviews" />
                <StatBox
                  icon={<ViewListIcon className="w-4 h-4" />}
                  value={countEvents(data?.events)}
                  title="events"
                />
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
