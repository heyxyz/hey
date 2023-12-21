import type { Dispatch, FC, SetStateAction } from 'react';

import {
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { FeatureFlag } from '@hey/data/feature-flags';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Leafwatch } from '@lib/leafwatch';

import Algorithms from './Algorithms';
import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        <TabButton
          active={feedType === HomeFeedType.FOLLOWING}
          icon={<UserGroupIcon className="size-4" />}
          name="Following"
          onClick={() => {
            setFeedType(HomeFeedType.FOLLOWING);
            Leafwatch.track(HOME.SWITCH_FOLLOWING_FEED);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.HIGHLIGHTS}
          icon={<LightBulbIcon className="size-4" />}
          name="Highlights"
          onClick={() => {
            setFeedType(HomeFeedType.HIGHLIGHTS);
            Leafwatch.track(HOME.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
        {isFeatureEnabled(FeatureFlag.LensMember) ? (
          <TabButton
            active={feedType === HomeFeedType.PAID_ACTIONS}
            icon={<CurrencyDollarIcon className="size-4" />}
            name="Paid actions"
            onClick={() => {
              setFeedType(HomeFeedType.PAID_ACTIONS);
              Leafwatch.track(HOME.SWITCH_PAID_ACTIONS_FEED);
            }}
          />
        ) : null}
      </div>
      <div className="flex items-center space-x-4">
        {feedType === HomeFeedType.FOLLOWING ||
        feedType === HomeFeedType.HIGHLIGHTS ? (
          <SeeThroughLens />
        ) : null}
        {feedType === HomeFeedType.FOLLOWING ? <FeedEventFilters /> : null}
        {IS_MAINNET ? <Algorithms /> : null}
      </div>
    </div>
  );
};

export default FeedType;
