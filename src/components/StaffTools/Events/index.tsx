import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import axios from 'axios';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { APP_NAME, ERROR_MESSAGE, HOG_ENDPOINT } from 'src/constants';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';

const Events: NextPage = () => {
  const { allowed } = useStaffMode();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const getEvents = () => {
    axios
      .get(`${HOG_ENDPOINT}/api/projects/3/events?limit=20`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERSONAL_POSTHOG_TOKEN}`
        }
      })
      .then((res) => {
        setEvents(res?.data?.results);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    Hog.track('Pageview', { path: PAGEVIEW.STAFFTOOLS.EVENTS });
    getEvents();
    setInterval(() => getEvents(), 5000);
  }, []);

  if (!allowed) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Stafftools • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="divide-y">
          {error ? (
            <ErrorMessage className="m-5" title={ERROR_MESSAGE} error={error} />
          ) : events.length === 0 ? (
            <div className="p-5">Loading...</div>
          ) : (
            events?.map((event: any) => (
              <div key={event?.id} className="linkify px-5 py-3 space-y-2">
                <div>
                  <b>{event?.event}</b>
                </div>
                <div>
                  <div className="text-sm">
                    <b>Browser: </b>
                    <span>
                      {event?.properties?.['$browser']} {event?.properties?.['$browser_version']}
                    </span>
                  </div>
                  <div className="text-sm">
                    <b>Current URL: </b>
                    <a href={event?.properties?.['$current_url']} target="_blank" rel="noreferrer">
                      {event?.properties?.['$current_url']}
                    </a>
                  </div>
                  <div className="text-sm">
                    <b>Region: </b>
                    <span>
                      {event?.properties?.['$geoip_country_name']}, {event?.properties?.['$geoip_city_name']}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Events;
