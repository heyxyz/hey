import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import Seo from '@components/utils/Seo';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppPersistStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';
import CrossPost from './CrossPost';
import SetProfile from './SetProfile';
import Verification from './Verification';

const AccountSettings: NextPage = () => {
  const currentUser = useAppPersistStore((state) => state.currentUser);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.SETTINGS.ACCOUNT);
  }, []);

  if (!currentUser) {
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
