import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { FeatureFlag } from '@lenster/data';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { useEffectOnce } from 'usehooks-ts';

import EnableDispatcher from './EnableDispatcher';
import EnableMessages from './EnableMessages';
import FeedType, { Type } from './FeedType';
import ForYou from './ForYou';
import Hero from './Hero';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const isForYouEnabled = isFeatureEnabled(FeatureFlag.ForYou);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<Type>(Type.FOLLOWING);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  });

  useEffect(() => {
    setFeedType(isForYouEnabled ? Type.FOR_YOU : Type.FOLLOWING);
  }, [currentProfile, isForYouEnabled]);

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
              {feedType === Type.FOR_YOU ? (
                <ForYou />
              ) : feedType === Type.FOLLOWING ? (
                <Timeline />
              ) : (
                <Highlights />
              )}
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
