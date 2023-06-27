import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';
import Followers from './Followers';
import Following from './Following';
import Notifications from './Notifications';
import Profile from './Profile';
import Publications from './Publications';

const ExportSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

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
        <Profile />
        <Publications />
        <Notifications />
        <Following />
        <Followers />
      </GridItemEight>
    </GridLayout>
  );
};

export default ExportSettings;
