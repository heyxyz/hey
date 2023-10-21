import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import ToggleLensManager from './ToggleLensManager';

const LensManagerSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.lensManager;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'manager' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Manager • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="linkify space-y-2 p-5">
          <div className="space-y-3 pb-2">
            <div className="text-lg font-bold">
              {canUseRelay
                ? 'Disable signless transactions'
                : 'Signless transactions'}
            </div>
            <p>
              You can enable Lens manager to interact with {APP_NAME} without
              signing any of your transactions.
            </p>
          </div>
          <ToggleLensManager />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default LensManagerSettings;
