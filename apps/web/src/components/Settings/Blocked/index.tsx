import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@good/data/constants';
import { PAGEVIEW } from '@good/data/tracking';
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { useEffect } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import List from './List';

const BlockedSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'blocked' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Blocked profiles • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            body="This is a list of blocked profiles. You can unblock them at any time."
            title="Blocked profiles"
          />
          <List />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default BlockedSettings;
