import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { EyeIcon, ViewListIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { APP_NAME, ERROR_MESSAGE } from 'data/constants';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { SIMPLEANALYTICS_API_ENDPOINT } from 'src/constants';
import Custom404 from 'src/pages/404';

import StaffToolsSidebar from '../Sidebar';
import { StatBox } from '../Stats';

const Analytics: NextPage = () => {
  const { allowed } = useStaffMode();

  const { isLoading, error, data } = useQuery(
    'analyticsData',
    () =>
      axios({
        url: SIMPLEANALYTICS_API_ENDPOINT,
        params: {
          version: 5,
          fields: 'pageviews',
          start: 'today',
          events: '*',
          info: false
        }
      }).then((res) => res.data),
    {
      refetchInterval: 5000
    }
  );

  if (!allowed) {
    return <Custom404 />;
  }

  // count events from array of data.events in which total is the number
  // of events
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
              <h1 className="text-xl font-bold mb-4">Analytics</h1>
              <div className="block sm:flex space-y-3 sm:space-y-0 sm:space-x-3 justify-between">
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
