import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Toggle } from '@components/UI/Toggle';
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

const Flags: NextPage = () => {
  const { allowed } = useStaffMode();
  const [flags, setFlags] = useState([]);
  const [error, setError] = useState(false);

  const getFlags = () => {
    axios
      .get(`${HOG_ENDPOINT}/api/projects/3/feature_flags`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERSONAL_POSTHOG_TOKEN}`
        }
      })
      .then((res) => {
        setFlags(res?.data?.results);
      })
      .catch(() => {
        setError(true);
      });
  };

  const toggleFlag = (id: number, active: boolean) => {
    axios
      .patch(
        `${HOG_ENDPOINT}/api/projects/3/feature_flags/${id}`,
        { active: !active },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERSONAL_POSTHOG_TOKEN}`
          }
        }
      )
      .then(() => {
        getFlags();
      });
  };

  useEffect(() => {
    Hog.track('Pageview', { path: PAGEVIEW.STAFFTOOLS.FLAGS });
    getFlags();
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
            <ErrorMessage title={ERROR_MESSAGE} />
          ) : flags.length === 0 ? (
            <div className="p-5">Loading...</div>
          ) : (
            flags?.map((flag: any) => (
              <div key={flag?.id} className="linkify px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div>
                      <a className="font-bold" href={`${HOG_ENDPOINT}/feature_flags/${flag?.id}`}>
                        {flag?.key}
                      </a>
                      <div className="text-sm">{flag?.name}</div>
                    </div>
                    <div className="text-sm">
                      <b>Enrolled to: </b>
                      <span>{flag?.rollout_percentage ? `${flag?.rollout_percentage}%` : 'All users'}</span>
                    </div>
                  </div>
                  <Toggle
                    on={flag?.active}
                    setOn={() => {
                      toggleFlag(flag?.id, flag?.active);
                    }}
                  />
                </div>
                <details className="mt-3">
                  <summary className="text-sm">View Filters</summary>
                  <div className="bg-gray-300 dark:bg-gray-800 p-2 mt-2 rounded-lg text-xs font-mono">
                    {JSON.stringify(flag?.filters, null, 2)}
                  </div>
                </details>
              </div>
            ))
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Flags;
