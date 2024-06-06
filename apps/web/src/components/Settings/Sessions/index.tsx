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

const SessionsSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'sessions' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Sessions settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            body="This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize."
            title="Sessions"
          />
          <List />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default SessionsSettings;
