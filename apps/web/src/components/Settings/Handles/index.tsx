import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import Slug from '@components/Shared/Slug';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import LinkHandle from './LinkHandle';
import UnlinkHandle from './UnlinkHandle';

const HandlesSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'handles' });
  });

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
          <Card className="p-5">
            <div className="space-y-3">
              <div className="text-lg font-bold">
                Unlink <Slug slug={currentProfile.handle?.fullHandle} /> from
                your profile
              </div>
              <p>
                Unlinking your handle removes it from your profile, ensuring it
                is no longer publicly displayed or associated with your profile.
              </p>
            </div>
            <div className="divider my-5" />
            <UnlinkHandle />
          </Card>
        ) : null}
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Link a handle</div>
            <p>
              Linking your handle to your profile showcases it publicly,
              allowing others to easily identify and connect with you based on
              your unique online identity.
            </p>
          </div>
          <div className="divider my-5" />
          <LinkHandle />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default HandlesSettings;
