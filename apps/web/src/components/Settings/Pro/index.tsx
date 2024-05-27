import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import AppIcon from './AppIcon';
import Overview from './Overview';

const ProSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { isPro } = useProStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'preferences' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (!isPro) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Pro settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Overview />
        <AppIcon />
      </GridItemEight>
    </GridLayout>
  );
};

export default ProSettings;
