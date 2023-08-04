import {
  LightBulbIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { MISCELLANEOUS } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { TabButton } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { HomeFeedType } from 'src/enums';

import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';

interface FeedTypeProps {
  setFeedType: Dispatch<HomeFeedType>;
  feedType: HomeFeedType;
  setIsAlgorithmicFeed: Dispatch<boolean>;
}

const FeedType: FC<FeedTypeProps> = ({
  setFeedType,
  feedType,
  setIsAlgorithmicFeed
}) => {
  const isForYouEnabled = isFeatureEnabled(FeatureFlag.ForYou);
  const isAlgorithmicFeedEnabled = isFeatureEnabled(
    FeatureFlag.AlgorithmicFeed
  );

  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        <TabButton
          name={t`Following`}
          icon={<UserGroupIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.FOLLOWING}
          showOnSm={false}
          onClick={() => {
            setFeedType(HomeFeedType.FOLLOWING);
            Leafwatch.track(MISCELLANEOUS.SWITCH_FOLLOWING_FEED);
          }}
        />
        {isForYouEnabled && (
          <TabButton
            name={t`For you`}
            icon={<SparklesIcon className="h-4 w-4" />}
            active={feedType === HomeFeedType.FOR_YOU}
            showOnSm={false}
            onClick={() => {
              setFeedType(HomeFeedType.FOR_YOU);
              Leafwatch.track(MISCELLANEOUS.SWITCH_FOR_YOU_FEED);
            }}
          />
        )}
        <TabButton
          name={t`Highlights`}
          icon={<LightBulbIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.HIGHLIGHTS}
          showOnSm={false}
          onClick={() => {
            setFeedType(HomeFeedType.HIGHLIGHTS);
            Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
        {isAlgorithmicFeedEnabled && (
          <TabButton
            name={t`Recommended`}
            icon={<LightBulbIcon className="h-4 w-4" />}
            active={feedType === HomeFeedType.K3L_RECOMMENDED}
            showOnSm={false}
            onClick={() => {
              setFeedType(HomeFeedType.K3L_RECOMMENDED);
              setIsAlgorithmicFeed(true);
              // Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
            }}
          />
        )}
      </div>
      <div className="flex items-center space-x-4">
        <SeeThroughLens />
        {feedType === HomeFeedType.FOLLOWING && <FeedEventFilters />}
      </div>
    </div>
  );
};

export default FeedType;
