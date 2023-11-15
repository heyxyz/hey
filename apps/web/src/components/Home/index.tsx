import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import getCurrentSession from '@lib/getCurrentSession';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import AlgorithmicFeed from './AlgorithmicFeed';
import Tabs from './Algorithms/Tabs';
import EnableLensManager from './EnableLensManager';
import FeedType from './FeedType';
import Gitcoin from './Gitcoin';
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

  const { id: sessionProfileId } = getCurrentSession();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  });

  const loggedInWithProfile = Boolean(currentProfile);
  const loggedInWithWallet = Boolean(sessionProfileId);
  const loggedOut = !loggedInWithProfile;

  return (
    <>
      <MetaTags />
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
              ) : (
                <AlgorithmicFeed feedType={feedType} />
              )}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          <Gitcoin />
          {loggedOut && <Waitlist />}
          {loggedInWithProfile && <HeyMembershipNft />}
          {/* Onboarding steps */}
          {loggedInWithProfile && (
            <>
              <EnableLensManager />
              <SetProfile />
            </>
          )}
          {/* Recommendations */}
          {IS_MAINNET && <StaffPicks />}
          {loggedInWithProfile && <RecommendedProfiles />}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
