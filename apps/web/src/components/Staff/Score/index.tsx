import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';
import List from './List';

const Score: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'score' });
  }, []);

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Score • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight>
        <List />
      </GridItemEight>
    </GridLayout>
  );
};

export default Score;
