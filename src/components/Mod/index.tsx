import Footer from '@components/Shared/Footer';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import isGardener from '@lib/isGardener';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Feed from './Feed';

const Mod: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    Mixpanel.track('Pageview', { path: PAGEVIEW.MOD });
  }, []);

  if (!isGardener(currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags
        title={`Mod Center • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Feed />
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">TBD</Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Mod;
