import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card, CardBody } from '@components/UI/Card';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import React, { FC, useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Hog.track('Pageview', { path: PAGEVIEW.SETTINGS.DISPATCHER });
  }, []);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Dispatcher • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-2 linkify">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">
                {currentProfile?.dispatcher?.canUseRelay ? 'Disable' : 'Enable'} dispatcher
              </div>
            </div>
            <div className="pb-2">
              We suggest you to enable dispatcher so you don't need to sign all your transactions in{' '}
              {APP_NAME}.
            </div>
            <ToggleDispatcher />
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
