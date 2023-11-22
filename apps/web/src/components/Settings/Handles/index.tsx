import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import LinkHandle from './LinkHandle';

const HandlesSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'handles' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (!isFeatureEnabled(FeatureFlag.HandleSettings)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Handles settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Link or unlink handles</div>
            <p>
              You can link or unlink your handles to your profile. This will be
              used to display your handle on your profile.
            </p>
          </div>
          <div className="divider my-5" />
          <LinkHandle />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default HandlesSettings;
