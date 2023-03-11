import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import isGardener from '@lib/isGardener';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Feed from './Feed';

const Mod: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'mod' });
  }, []);

  if (!isGardener(currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Mod Center • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Feed refreshing={refreshing} setRefreshing={setRefreshing} />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">
          <Button disabled={refreshing} className="w-full" onClick={() => setRefreshing(true)}>
            Refresh feed
          </Button>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Mod;
