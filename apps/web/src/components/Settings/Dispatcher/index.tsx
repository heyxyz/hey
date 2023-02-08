import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { t, Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

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
            <div className="text-lg font-bold">
              {currentProfile?.dispatcher?.canUseRelay ? 'Disable' : 'Enable'} dispatcher
            </div>
          </div>
          <div className="pb-2">
            <Trans>
              We suggest you to enable dispatcher so you don't need to sign all your transactions in{' '}
              {APP_NAME}.
            </Trans>
          </div>
          <ToggleDispatcher />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
