import MetaTags from '@components/Common/MetaTags';
import Signup from '@components/Shared/Login/New';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { APP_NAME } from '@lenster/data/constants';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';
import { useEffectOnce } from 'usehooks-ts';

const NewProfile: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'new-profile' });
  });

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Create Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading="Create profile"
          description={t`Create new decentralized profile`}
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
