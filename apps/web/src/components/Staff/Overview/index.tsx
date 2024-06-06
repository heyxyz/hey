import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@good/data/constants';
import { PAGEVIEW } from '@good/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';
import LeafwatchStats from './LeafwatchStats';
import Links from './Links';

const Overview: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'overview' });
  }, []);

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <LeafwatchStats />
        </Card>
        <Card className="p-5">
          <Links />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
