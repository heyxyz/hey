import MetaTags from '@components/Common/MetaTags';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { FeatureFlag } from 'data';
import { APP_NAME } from 'data/constants';
import isFeatureEnabled from 'lib/isFeatureEnabled';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { GridItemEight, GridItemFour, GridLayout } from 'ui';

import SettingsSidebar from '../Sidebar';
import Publications from './Publications';

const ExportSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'settings', subpage: 'export' });
  }, []);

  if (!isFeatureEnabled(FeatureFlag.ExportData, currentProfile?.id)) {
    return <Custom404 />;
  }

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Publications />
      </GridItemEight>
    </GridLayout>
  );
};

export default ExportSettings;
