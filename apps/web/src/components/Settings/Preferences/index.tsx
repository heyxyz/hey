import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import NotLoggedIn from '@/components/Shared/NotLoggedIn';
import isFeatureEnabled from '@/lib/isFeatureEnabled';
import { Leafwatch } from '@/lib/leafwatch';
import useProfileStore from '@/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import Email from './Email';
import HighSignalNotificationFilter from './HighSignalNotificationFilter';
import IsPride from './IsPride';
import PushNotifications from './PushNotifications';

const PreferencesSettings = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'preferences' });
  });

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
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Your Preferences</div>
            <p>
              Update your preferences to control how you can change your
              experience on {APP_NAME}.
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <HighSignalNotificationFilter />
            {isFeatureEnabled('push-notifications') && <PushNotifications />}
            <IsPride />
            <div className="divider my-5" />
            {isFeatureEnabled('email') && <Email />}
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
