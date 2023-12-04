import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import List from './List';

const ActionsSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'actions' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Action History • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Actions</div>
            <p>This is a list of actions on your account.</p>
          </div>
          <div className="divider my-5" />
          <List />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ActionsSettings;
