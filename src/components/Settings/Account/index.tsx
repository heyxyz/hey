import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import Seo from '@components/utils/Seo';
import { Hog } from '@lib/hog';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';
import CrossPost from './CrossPost';
import SetProfile from './SetProfile';
import Verification from './Verification';

const AccountSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Hog.track('Pageview', { page: PAGEVIEW.SETTINGS.ACCOUNT });
  }, []);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SetProfile />
        <SuperFollow />
        <Verification />
        <CrossPost />
      </GridItemEight>
    </GridLayout>
  );
};

export default AccountSettings;
