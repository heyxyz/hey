import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import NotLoggedIn from 'src/pages/notloggedin';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import DeleteSettings from './Delete';
import GuardianSettings from './Guardian';

const DangerSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'danger' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Delete Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <GuardianSettings />
        <DeleteSettings />
      </GridItemEight>
    </GridLayout>
  );
};

export default DangerSettings;
