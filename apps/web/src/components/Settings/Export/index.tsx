import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import useProfilePersistStore from 'src/store/useProfilePersistStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Followers from './Followers';
import Following from './Following';
import Notifications from './Notifications';
import Profile from './Profile';
import Publications from './Publications';
import Tokens from './Tokens';

const ExportSettings: NextPage = () => {
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'export' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile />
        <Publications />
        <Notifications />
        <Following />
        <Followers />
        <Tokens />
      </GridItemEight>
    </GridLayout>
  );
};

export default ExportSettings;
