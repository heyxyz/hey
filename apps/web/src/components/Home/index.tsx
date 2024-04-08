import type { NextPage } from 'next';

import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEffect, useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import PaidActions from './PaidActions';
import Sidebar from './Sidebar';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  }, []);

  const loggedInWithProfile = Boolean(currentProfile);

  return (
    <>
      {!loggedInWithProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.HIGHLIGHTS ? (
                <Highlights />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : null}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
