import type { Dispatch, FC, SetStateAction } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { HomeFeedType } from '@hey/data/enums';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const { fallbackToCuratedFeed } = useProfileStore();

  return (
    <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
      <TabButton
        active={feedType === HomeFeedType.FOLLOWING}
        icon={
          fallbackToCuratedFeed ? (
            <CheckCircleIcon className="size-4" />
          ) : (
            <UserGroupIcon className="size-4" />
          )
        }
        name={fallbackToCuratedFeed ? 'Curated Feed' : 'Following'}
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
      <TabButton
        active={feedType === HomeFeedType.PREMIUM}
        icon={<CurrencyDollarIcon className="size-4" />}
        name="Premium"
        onClick={() => {
          setFeedType(HomeFeedType.PREMIUM);
          Leafwatch.track(HOME.SWITCH_PREMIUM_FEED);
        }}
      />
    </div>
  );
};

export default FeedType;
