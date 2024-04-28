import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import WrongWallet from '@components/Shared/Settings/WrongWallet';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useAccount } from 'wagmi';

import SettingsSidebar from '../Sidebar';
import LensManager from './LensManager';
import ProfileManager from './ProfileManager';

const ManagerSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { address } = useAccount();
  const disabled = currentProfile?.ownedBy.address !== address;

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'manager' });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Manager • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {disabled ? (
          <WrongWallet />
        ) : (
          <>
            <LensManager />
            <ProfileManager />
          </>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default ManagerSettings;
