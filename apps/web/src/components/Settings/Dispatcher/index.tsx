import MetaTags from '@components/Common/MetaTags';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, OLD_LENS_RELAYER_ADDRESS } from 'data/constants';
import getIsDispatcherEnabled from 'lib/getIsDispatcherEnabled';
import type { FC } from 'react';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';

import SettingsSidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = getIsDispatcherEnabled(currentProfile);
  const isOldDispatcherEnabled =
    currentProfile?.dispatcher?.address?.toLocaleLowerCase() === OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'settings', subpage: 'dispatcher' });
  }, []);

  const getTitleText = () => {
    if (canUseRelay) {
      return <Trans>Disable dispatcher</Trans>;
    } else if (isOldDispatcherEnabled) {
      return <Trans>Update dispatcher</Trans>;
    } else {
      return <Trans>Enable dispatcher</Trans>;
    }
  };

  const getDescription = () => {
    if (isOldDispatcherEnabled) {
      return (
        <Trans>We highly recommend that you update to our new dispatcher for a faster experience.</Trans>
      );
    }
    return (
      <Trans>
        You can enable dispatcher to interact with {APP_NAME} without signing any of your transactions.
      </Trans>
    );
  };

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Dispatcher • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="linkify space-y-2 p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">{getTitleText()}</div>
          </div>
          <div className="pb-2">{getDescription()}</div>
          <ToggleDispatcher />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
