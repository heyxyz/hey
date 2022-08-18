import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card, CardBody } from '@components/UI/Card';
import { Toggle } from '@components/UI/Toggle';
import Seo from '@components/utils/Seo';
import { Mixpanel } from '@lib/mixpanel';
import mixpanel from 'mixpanel-browser';
import React, { FC, useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppPersistStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';

const DataSettings: FC = () => {
  const currentUser = useAppPersistStore((state) => state.currentUser);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.SETTINGS.DATA);
  }, []);

  useEffect(() => {
    if (mixpanel.has_opted_out_tracking()) {
      setDisabled(true);
    }
  }, []);

  if (!currentUser) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Data • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-2 linkify">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">Tracking Preference</div>
            </div>
            <div>We collect your usage data to improve your experience in {APP_NAME}.</div>
            <div className="flex items-center space-x-2 pt-2">
              <Toggle
                on={disabled}
                setOn={() => {
                  if (disabled) {
                    mixpanel.opt_in_tracking();
                    setDisabled(false);
                  } else {
                    mixpanel.opt_out_tracking();
                    setDisabled(true);
                  }
                }}
              />
              <div>Opt out of tracking</div>
            </div>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DataSettings;
