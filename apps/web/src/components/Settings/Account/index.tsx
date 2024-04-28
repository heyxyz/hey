import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import DefaultProfile from './DefaultProfile';
import Email from './Email';
import RateLimits from './RateLimits';
import Verification from './Verification';

const AccountSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'account' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Email />
        <SuperFollow />
        <DefaultProfile />
        <RateLimits />
        <Verification />
      </GridItemEight>
    </GridLayout>
  );
};

export default AccountSettings;
