import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import { Leafwatch } from '@/lib/leafwatch';
import Custom404 from '@/pages/404';
import { useFeatureFlagsStore } from '@/store/persisted/useFeatureFlagsStore';
import useProfileStore from '@/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';

const Users = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'users' });
  });

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Users • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">Users WIP</Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Users;
