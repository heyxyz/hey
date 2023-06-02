import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import Feed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { Mixpanel } from '@lib/mixpanel';
import { IS_RELAYER_AVAILABLE } from 'data';
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

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'home' });
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
              {feedType === 'TIMELINE' ? <Timeline /> : <Highlights />}
            </>
          ) : (
            <Feed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? (
            <>
              {IS_RELAYER_AVAILABLE && <EnableDispatcher />}
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
