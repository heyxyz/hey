import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import List from '@components/Staff/Users/List';
import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { ModFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import FeedType from './FeedType';
import Filter from './Filter';
import LatestFeed from './LatestFeed';
import ReportsFeed from './ReportsFeed';
import SearchFeed from './SearchFeed';

const Mod: NextPage = () => {
  const { gardenerMode } = useFeatureFlagsStore();
  const [feedType, setFeedType] = useState<ModFeedType>(ModFeedType.LATEST);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'mod' });
  }, []);

  if (!gardenerMode) {
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
