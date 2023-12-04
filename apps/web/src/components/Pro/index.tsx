import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

const Pro: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'pro' });
  });

  if (!currentProfile || !isFeatureEnabled(FeatureFlag.Pro)) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Pro • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Card className="p-5">gm</Card>
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">gm</Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Pro;
