import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.lensManager;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'dispatcher' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Dispatcher • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="linkify space-y-2 p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">
              {canUseRelay
                ? 'Disable signless transactions'
                : 'Signless transactions'}
            </div>
          </div>
          <div className="pb-2">
            You can enable dispatcher to interact with {APP_NAME} without
            signing any of your transactions.
          </div>
          <ToggleDispatcher />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
