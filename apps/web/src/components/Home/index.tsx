import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import AlgorithmicFeed from './AlgorithmicFeed';
import Tabs from './Algorithms/Tabs';
import EnableLensManager from './EnableLensManager';
import EnableMessages from './EnableMessages';
import FeedType from './FeedType';
import Hero from './Hero';
import HeyMembershipNft from './HeyMembershipNft';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetProfile from './SetProfile';
import StaffPicks from './StaffPicks';
import Timeline from './Timeline';
import Waitlist from './Waitlist';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  });

  const loggedIn = Boolean(currentProfile);
  const loggedOut = !loggedIn;

  return (
    <>
      <MetaTags />
      {!currentProfile ? <Hero /> : null}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
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
              ) : (
                <AlgorithmicFeed feedType={feedType} />
              )}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {/* <Gitcoin /> */}
          {loggedOut && <Waitlist />}
          {loggedIn && <HeyMembershipNft />}
          {/* Onboarding steps */}
          {loggedIn && (
            <>
              <EnableLensManager />
              <EnableMessages />
              <SetProfile />
            </>
          )}
          {/* Recommendations */}
          {IS_MAINNET && <StaffPicks />}
          {loggedIn && <RecommendedProfiles />}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
