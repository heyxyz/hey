import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import BetaWarning from '@components/Home/BetaWarning';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { Dogstats } from '@lib/dogstats';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import EnableDispatcher from './EnableDispatcher';
import HomeFeed from './Feed';
import Hero from './Hero';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Trending from './Trending';

const Home: NextPage = () => {
  useEffect(() => {
    Dogstats.track('Pageview', { path: PAGEVIEW.HOME });
  }, []);

  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <>
      <MetaTags />
      {!currentProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              <NewPost />
              <HomeFeed />
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? <EnableDispatcher /> : null}
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
