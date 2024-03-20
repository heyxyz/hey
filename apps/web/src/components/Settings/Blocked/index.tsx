import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
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
          <div className="space-y-1 p-5">
            <div className="text-lg font-bold">Blocked profiles</div>
            <p>
              This is a list of blocked profiles. You can unblock them at any
              time.
            </p>
          </div>
          <div className="divider" />
          <List />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default BlockedSettings;
