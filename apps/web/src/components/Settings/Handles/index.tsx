import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import Slug from '@components/Shared/Slug';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { useEffect } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import LinkHandle from './LinkHandle';
import UnlinkHandle from './UnlinkHandle';

const HandlesSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'handles' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Handles settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {currentProfile.handle ? (
          <Card>
            <CardHeader
              body="Unlinking your handle removes it from your profile, ensuring it
              is no longer publicly displayed or associated with your profile."
              title={
                <span>
                  Unlink <Slug slug={currentProfile.handle?.fullHandle} /> from
                  your profile
                </span>
              }
            />
            <UnlinkHandle />
          </Card>
        ) : null}
        <Card>
          <CardHeader
            body="Linking your handle to your profile showcases it publicly,
            allowing others to easily identify and connect with you based on
            your unique online identity."
            title="Link a handle"
          />
          <LinkHandle />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default HandlesSettings;
