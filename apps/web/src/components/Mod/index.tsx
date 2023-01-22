import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import isGardener from '@lib/isGardener';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import Feed from './Feed';

const Mod: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!isGardener(currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Mod Center • ${APP_NAME}`} />
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
