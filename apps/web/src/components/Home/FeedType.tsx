import {
  LightBulbIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@hey/data/constants';
import { HomeFeedType } from '@hey/data/enums';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { Dispatch, FC, SetStateAction } from 'react';
import { usePreferencesStore } from 'src/store/preferences';

import Algorithms from './Algorithms';
import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';

interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  feedType: HomeFeedType;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const isLensMember = usePreferencesStore((state) => state.isLensMember);

  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        <TabButton
          name={t`Following`}
          icon={<UserGroupIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.FOLLOWING}
          onClick={() => {
            setFeedType(HomeFeedType.FOLLOWING);
            Leafwatch.track(HOME.SWITCH_FOLLOWING_FEED);
          }}
        />
        {isLensMember ? (
          <TabButton
            name={t`For you`}
            icon={<SparklesIcon className="h-4 w-4" />}
            active={feedType === HomeFeedType.FOR_YOU}
            onClick={() => {
              setFeedType(HomeFeedType.FOR_YOU);
              Leafwatch.track(HOME.SWITCH_FOR_YOU_FEED);
            }}
          />
        ) : null}
        <TabButton
          name={t`Highlights`}
          icon={<LightBulbIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.HIGHLIGHTS}
          onClick={() => {
            setFeedType(HomeFeedType.HIGHLIGHTS);
            Leafwatch.track(HOME.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
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
