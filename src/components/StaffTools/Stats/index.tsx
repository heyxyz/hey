import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card, CardBody } from '@components/UI/Card';
import Seo from '@components/utils/Seo';
import isStaff from '@lib/isStaff';
import { NextPage } from 'next';
import React from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppPersistStore, useAppStore } from 'src/store/app';

import Sidebar from '../Sidebar';

const Stats: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useAppPersistStore((state) => state.staffMode);
  const notAllowed = !currentProfile || !isStaff(currentProfile?.id) || !staffMode;

  if (notAllowed) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Stafftools • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <CardBody className="space-y-5">GM</CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Stats;
