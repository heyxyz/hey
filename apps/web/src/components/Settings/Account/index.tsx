import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import SuperFollow from '@/components/Settings/Account/SuperFollow';
import NotLoggedIn from '@/components/Shared/NotLoggedIn';
import { Leafwatch } from '@/lib/leafwatch';
import useProfileStore from '@/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import Verification from './Verification';

const AccountSettings = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'account' });
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
        <SuperFollow />
        <Verification />
      </GridItemEight>
    </GridLayout>
  );
};

export default AccountSettings;
