import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';
import Events from './Events';

const Realtime: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'realtime' });
  }, []);

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Realtime • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Events />
      </GridItemEight>
    </GridLayout>
  );
};

export default Realtime;
