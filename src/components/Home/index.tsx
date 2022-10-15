import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import BetaWarning from '@components/Home/BetaWarning';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import EnableDispatcher from './EnableDispatcher';
import EnableMessages from './EnableMessages';
import HomeFeed from './Feed';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Trending from './Trending';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'TIMELINE' | 'HIGHLIGHTS'>('TIMELINE');

  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.HOME });
  }, []);

  return (
    <>
      <MetaTags />
      {!currentProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === 'TIMELINE' ? <HomeFeed /> : <Highlights />}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? <EnableDispatcher /> : null}
          {isFeatureEnabled('messages', currentProfile?.id) && <EnableMessages />}
          <BetaWarning />
          {isFeatureEnabled('trending-widget', currentProfile?.id) && <Trending />}
          {currentProfile ? (
            <>
              <SetDefaultProfile />
              <SetProfile />
              <RecommendedProfiles />
            </>
          ) : null}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
