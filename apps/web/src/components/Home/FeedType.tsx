import TabButton from '@components/UI/TabButton';
import { SparklesIcon, ViewListIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';

interface Props {
  setFeedType: Dispatch<'TIMELINE' | 'HIGHLIGHTS'>;
  feedType: 'TIMELINE' | 'HIGHLIGHTS';
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        <TabButton
          name={t`Timeline`}
          icon={<ViewListIcon className="h-4 w-4" />}
          active={feedType === 'TIMELINE'}
          showOnSm={false}
          onClick={() => {
            setFeedType('TIMELINE');
            Analytics.track(MISCELLANEOUS.SWITCH_TIMELINE);
          }}
        />
        <TabButton
          name={t`Highlights`}
          icon={<SparklesIcon className="h-4 w-4" />}
          active={feedType === 'HIGHLIGHTS'}
          showOnSm={false}
          onClick={() => {
            setFeedType('HIGHLIGHTS');
            Analytics.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS);
          }}
        />
      </div>
      <div className="flex items-center space-x-4">
        <SeeThroughLens />
        {feedType === 'TIMELINE' && <FeedEventFilters />}
      </div>
    </div>
  );
};

export default FeedType;
