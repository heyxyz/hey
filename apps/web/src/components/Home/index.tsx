import type { NextPage } from 'next';

import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Navbar from '@components/Shared/Navbar';
import { HomeFeedType } from '@good/data/enums';
import { PAGEVIEW } from '@good/data/tracking';
import { GridItemEight, GridItemTwo, GridLayout } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { useEffect, useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import FeedType from './FeedType';
import ForYou from './ForYou';
import Hero from './Hero';
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
        <GridItemTwo>
          <Navbar />
        </GridItemTwo>

        <GridItemEight className="space-y-5">
          {loggedInWithProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.FORYOU ? (
                <ForYou />
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
              ) : null}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemTwo>
          <Sidebar />
        </GridItemTwo>
      </GridLayout>
    </>
  );
};

export default Home;
