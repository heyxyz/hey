import type { NextPage } from 'next';

import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import getCurrentSession from '@lib/getCurrentSession';
import { Leafwatch } from '@lib/leafwatch';
import { useEffect, useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import AlgorithmicFeed from './AlgorithmicFeed';
import Tabs from './Algorithms/Tabs';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import PaidActions from './PaidActions';
import Sidebar from './Sidebar';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );

  const { id: sessionProfileId } = getCurrentSession();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  }, []);

  const loggedInWithProfile = Boolean(currentProfile);
  const loggedInWithWallet = Boolean(sessionProfileId);
  const loggedOut = !loggedInWithProfile;

  return (
    <>
      {loggedOut && !loggedInWithWallet && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <div className="space-y-3">
                <FeedType feedType={feedType} setFeedType={setFeedType} />
                <Tabs feedType={feedType} setFeedType={setFeedType} />
              </div>
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.HIGHLIGHTS ? (
                <Highlights />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : (
                <AlgorithmicFeed feedType={feedType} />
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
