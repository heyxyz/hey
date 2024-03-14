import type { FC } from 'react';

import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Algorithms from './Algorithms';
import SeeThroughLens from './SeeThroughLens';

const FeedType: FC = () => {
  const { query, replace } = useRouter();
  const { fallbackToCuratedFeed } = useProfileStore();
  const feedType =
    (query.type as string).toUpperCase() || HomeFeedType.FOLLOWING;

  const shallowReplace = (type: HomeFeedType) => {
    replace({ query: { ...query, type: type.toLowerCase() } }, undefined, {
      shallow: true
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
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
            shallowReplace(HomeFeedType.FOLLOWING);
            Leafwatch.track(HOME.SWITCH_FOLLOWING_FEED);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.HIGHLIGHTS}
          icon={<LightBulbIcon className="size-4" />}
          name="Highlights"
          onClick={() => {
            shallowReplace(HomeFeedType.HIGHLIGHTS);
            Leafwatch.track(HOME.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.PREMIUM}
          icon={<CurrencyDollarIcon className="size-4" />}
          name="Premium"
          onClick={() => {
            shallowReplace(HomeFeedType.PREMIUM);
            Leafwatch.track(HOME.SWITCH_PREMIUM_FEED);
          }}
        />
      </div>
      <div className="flex items-center space-x-4">
        {feedType === HomeFeedType.FOLLOWING ||
        feedType === HomeFeedType.HIGHLIGHTS ? (
          <SeeThroughLens />
        ) : null}
        {IS_MAINNET ? <Algorithms /> : null}
      </div>
    </div>
  );
};

export default FeedType;
