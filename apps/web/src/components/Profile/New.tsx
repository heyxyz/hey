import type { NextPage } from 'next';

import Signup from '@components/Shared/Login/New';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

const NewProfile: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'new-profile' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <GridItemFour>
        <SettingsHelper
          description="Create new decentralized profile"
          heading="Create profile"
        />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <Signup />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewProfile;
