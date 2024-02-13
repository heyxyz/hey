import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';
import Balance from './Balance';
import ProfilesCreated from './ProfilesCreated';
import SignupPrice from './SignupPrice';

const SignupContract: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'staff-tools',
      subpage: 'singup-contract'
    });
  }, []);

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Signup Contract • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <div className="p-5 text-lg font-bold">Signup Contract</div>
          <div className="divider" />
          <div className="space-y-5 p-5">
            <SignupPrice />
            <ProfilesCreated />
            <Balance />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default SignupContract;
