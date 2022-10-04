import NewPost from '@components/Composer/Post/New';
import NewPostV2 from '@components/Composer/PostV2/New';
import ExploreFeed from '@components/Explore/Feed';
import Announcement from '@components/Home/Announcement';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import Seo from '@components/utils/Seo';
import getFeatureEnabled from '@lib/getFeatureEnabled';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
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
    Mixpanel.track('Pageview', { path: PAGEVIEW.HOME });
  }, []);

  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <>
      <Seo />
      {!currentProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              {getFeatureEnabled('composer-v2', currentProfile?.id) ? <NewPostV2 /> : <NewPost />}
              <HomeFeed />
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? <EnableDispatcher /> : null}
          <Announcement />
          <Trending />
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
