import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card } from '@components/UI/Card';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';

const Flags: NextPage = () => {
  const { allowed } = useStaffMode();

  useEffect(() => {
    Hog.track('Pageview', { path: PAGEVIEW.STAFFTOOLS.FLAGS });
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
        <Card className="p-5">gm</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Flags;
