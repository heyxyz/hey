import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Custom404 from 'src/pages/404';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import SettingsSidebar from '../Sidebar';
import LensManager from './LensManager';
import ProfileManager from './ProfileManager';

const ManagerSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { address } = useAccount();
  const disabled = currentProfile?.ownedBy.address !== address;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'manager' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (disabled) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Manager • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <LensManager />
        <ProfileManager />
      </GridItemEight>
    </GridLayout>
  );
};

export default ManagerSettings;
