import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import StaffSidebar from './Sidebar';

const Staff: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'overview' });
  });

  if (!currentProfile || !isFeatureEnabled(FeatureFlag.Pro)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Pro • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">WIP</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Staff;
