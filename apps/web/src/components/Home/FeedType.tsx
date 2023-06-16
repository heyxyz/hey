import {
  SparklesIcon,
  UserGroupIcon,
  UsersIcon,
  ViewListIcon
} from '@heroicons/react/outline';
import { TabButton } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';
import { Growthbook } from '@lib/growthbook';
import { FeatureFlag } from '@lenster/data';
import useFeatureFlag from '@components/utils/hooks/useFeatureFlag';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

export enum Type {
  FOR_YOU = 'FOR_YOU',
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS'
}

interface FeedTypeProps {
  setFeedType: Dispatch<Type>;
  feedType: Type;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const isForYouEnabled = useFeatureIsOn(FeatureFlag.ForYou as string);

  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      {isForYouEnabled ? Type.FOR_YOU : Type.FOLLOWING}
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        {isForYouEnabled && (
          <TabButton
            name={t`For you`}
            icon={<SparklesIcon className="h-4 w-4" />}
            active={feedType === Type.FOR_YOU}
            showOnSm={false}
            onClick={() => {
              setFeedType(Type.FOR_YOU);
              Leafwatch.track(MISCELLANEOUS.SWITCH_FOR_YOU_FEED);
            }}
          />
        )}
        <TabButton
          name={t`Following`}
          icon={<UserGroupIcon className="h-4 w-4" />}
          active={feedType === Type.FOLLOWING}
          showOnSm={false}
          onClick={() => {
            setFeedType(Type.FOLLOWING);
            Leafwatch.track(MISCELLANEOUS.SWITCH_FOLLOWING_FEED);
          }}
        />
        <TabButton
          name={t`Highlights`}
          icon={<SparklesIcon className="h-4 w-4" />}
          active={feedType === Type.HIGHLIGHTS}
          showOnSm={false}
          onClick={() => {
            setFeedType(Type.HIGHLIGHTS);
            Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
          }}
        />
      </div>
      <div className="flex items-center space-x-4">
        <SeeThroughLens />
        {feedType === Type.FOLLOWING && <FeedEventFilters />}
      </div>
    </div>
  );
};

export default FeedType;
