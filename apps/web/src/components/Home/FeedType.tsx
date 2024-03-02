import type { Dispatch, FC, SetStateAction } from 'react';

import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Algorithms from './Algorithms';
import SeeThroughLens from './SeeThroughLens';

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const fallbackToCuratedFeed = useProfileStore(
    (state) => state.fallbackToCuratedFeed
  );

  return (
    <div className="flex flex-wrap items-center justify-between px-3 md:px-0">
      <div className="flex flex-wrap gap-x-6 overflow-x-auto sm:px-0">
        <TabButton
          active={feedType === HomeFeedType.FOLLOWING}
          name={fallbackToCuratedFeed ? 'Curated Feed' : 'Following'}
          onClick={() => {
            setFeedType(HomeFeedType.FOLLOWING);
            Leafwatch.track(HOME.SWITCH_FOLLOWING_FEED);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.HIGHLIGHTS}
          name="Highlights"
          onClick={() => {
            setFeedType(HomeFeedType.HIGHLIGHTS);
            Leafwatch.track(HOME.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.PREMIUM}
          hideOnSm
          name="Premium"
          onClick={() => {
            setFeedType(HomeFeedType.PREMIUM);
            Leafwatch.track(HOME.SWITCH_PREMIUM_FEED);
          }}
        />
      </div>
      <div className="flex items-center space-x-4">
        {feedType === HomeFeedType.FOLLOWING ||
        feedType === HomeFeedType.HIGHLIGHTS ? (
          <SeeThroughLens />
        ) : null}
        {IS_MAINNET ? (
          <Algorithms feedType={feedType} setFeedType={setFeedType} />
        ) : null}
      </div>
    </div>
  );
};

export default FeedType;
