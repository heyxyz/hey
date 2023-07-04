import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { Mixpanel } from '@lib/mixpanel';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { GridItemEight, GridItemFour, GridLayout } from 'ui';

import EnableDispatcher from './EnableDispatcher';
import EnableMessages from './EnableMessages';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'TIMELINE' | 'HIGHLIGHTS'>('TIMELINE');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'home' });
  }, []);

  const WelcomeBanner = () => {
    return (
      <span className="mx-4 mt-3 flex items-center justify-between rounded-md bg-purple-500 p-5 text-lg font-medium text-white">
        Welcome to Quadratic Lenster! This project is a fork of Lenster and enables quadratic tipping via
        quadratic funding rounds.
        <button
          type="button"
          className="ml-4 text-sm font-medium text-white underline"
          onClick={() => setShowWelcomeBanner(false)}
        >
          Dismiss
        </button>
      </span>
    );
  };

  return (
    <>
      <MetaTags />
      {!currentProfile && <Hero />}
      {showWelcomeBanner && <WelcomeBanner />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === 'TIMELINE' ? <Timeline /> : <Highlights />}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? (
            <>
              <EnableDispatcher />
              <EnableMessages />
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
