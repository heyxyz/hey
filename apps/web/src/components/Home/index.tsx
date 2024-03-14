import type { NextPage } from 'next';

import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import AlgorithmicFeed from './AlgorithmicFeed';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import PaidActions from './PaidActions';
import Sidebar from './Sidebar';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const { query } = useRouter();
  const { currentProfile } = useProfileStore();
  const feedType =
    (query.type as string).toUpperCase() || HomeFeedType.FOLLOWING;

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
              <FeedType />
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.HIGHLIGHTS ? (
                <Highlights />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : (
                <AlgorithmicFeed />
              )}
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
