import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import List from '@components/Staff/Users/List';
import { APP_NAME } from '@good/data/constants';
import { ModFeedType } from '@good/data/enums';
import { FeatureFlag } from '@good/data/feature-flags';
import { PAGEVIEW } from '@good/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@good/ui';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { Leafwatch } from '@helpers/leafwatch';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';

import FeedType from './FeedType';
import Filter from './Filter';
import LatestFeed from './LatestFeed';
import ReportsFeed from './ReportsFeed';
import SearchFeed from './SearchFeed';

const Mod: NextPage = () => {
  const [feedType, setFeedType] = useState<ModFeedType>(ModFeedType.LATEST);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'mod' });
  }, []);

  if (!isFeatureAvailable(FeatureFlag.Gardener)) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Mod Center • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedType feedType={feedType} setFeedType={setFeedType} />
        {feedType === ModFeedType.LATEST && <LatestFeed />}
        {feedType === ModFeedType.SEARCH && <SearchFeed />}
        {feedType === ModFeedType.PROFILES && <List />}
        {feedType === ModFeedType.REPORTS && <ReportsFeed />}
      </GridItemEight>
      <GridItemFour>
        {(feedType === ModFeedType.LATEST ||
          feedType === ModFeedType.SEARCH) && <Filter />}
        {feedType === ModFeedType.PROFILES && (
          <Card className="p-5">
            <div>All the profiles</div>
          </Card>
        )}
        {feedType === ModFeedType.REPORTS && (
          <Card className="p-5">
            <div>Reported Publications</div>
          </Card>
        )}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Mod;
