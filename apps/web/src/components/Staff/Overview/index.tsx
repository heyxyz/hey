import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import { Leafwatch } from '@/lib/leafwatch';

import StaffSidebar from '../Sidebar';

const Overview = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'overview' });
  });

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
        <Card className="p-5">Overview WIP</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
