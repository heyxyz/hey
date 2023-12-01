import { HomeFeedType } from '@hey/data/enums';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import NewPost from '@/components/Composer/Post/New';
import ExploreFeed from '@/components/Explore/Feed';
import Footer from '@/components/Shared/Footer';
import getCurrentSession from '@/lib/getCurrentSession';
import { Leafwatch } from '@/lib/leafwatch';
import useProfileStore from '@/store/persisted/useProfileStore';

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

const Home = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
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
          <StaffPicks />
          {loggedInWithProfile && <RecommendedProfiles />}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
