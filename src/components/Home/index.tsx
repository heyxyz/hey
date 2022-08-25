import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import Announcement from '@components/Home/Announcement';
import Footer from '@components/Shared/Footer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import Seo from '@components/utils/Seo';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import EnableDispatcher from './EnableDispatcher';
import Hero from './Hero';
import ProfileWarning from './ProfileWarning';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Streak from './Streak';

const HomeFeed = dynamic(() => import('./Feed'), {
  loading: () => <PublicationsShimmer />
});
const ExploreFeed = dynamic(() => import('@components/Explore/Feed'), {
  loading: () => <PublicationsShimmer />
});

const Home: NextPage = () => {
  useEffect(() => {
    Mixpanel.track(PAGEVIEW.HOME);
  }, []);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const isConnected = useAppPersistStore((state) => state.isConnected);

  return (
    <>
      <Seo />
      {isConnected && !currentProfile && <ProfileWarning />}
      {!isConnected && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">{currentProfile ? <HomeFeed /> : <ExploreFeed />}</GridItemEight>
        <GridItemFour>
          {currentProfile ? <EnableDispatcher /> : null}
          <Announcement />
          {currentProfile ? (
            <>
              <SetDefaultProfile />
              <SetProfile />
              <Streak />
            </>
          ) : null}
          <RecommendedProfiles />
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
