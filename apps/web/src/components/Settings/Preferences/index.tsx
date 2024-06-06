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
import HighSignalNotificationFilter from './HighSignalNotificationFilter';
import PushNotifications from './PushNotifications';

const PreferencesSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'preferences' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Preferences settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            body={`Update your preferences to control how you can change your
            experience on ${APP_NAME}.`}
            title="Your Preferences"
          />
          <div className="m-5 space-y-6">
            <HighSignalNotificationFilter />
            <PushNotifications />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
