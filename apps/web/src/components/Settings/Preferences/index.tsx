import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import HighSignalNotificationFilter from './HighSignalNotificationFilter';
import IsPride from './IsPride';

const PreferencesSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'preferences' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="text-lg font-bold">
              <Trans>Your Preferences</Trans>
            </div>
            <p>
              <Trans>
                Update your preferences to control how you can change your
                experience on {APP_NAME}.
              </Trans>
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <HighSignalNotificationFilter />
            <IsPride />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
