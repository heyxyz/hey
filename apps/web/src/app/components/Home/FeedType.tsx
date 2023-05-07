'use client';
import { SparklesIcon, ViewListIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';
import { TabButton } from 'ui';

import FeedEventFilters from './FeedEventFilters';
import SeeThroughLens from './SeeThroughLens';

interface FeedTypeProps {
  setFeedType: Dispatch<'TIMELINE' | 'HIGHLIGHTS'>;
  feedType: 'TIMELINE' | 'HIGHLIGHTS';
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
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
            Mixpanel.track(MISCELLANEOUS.SWITCH_TIMELINE);
          }}
        />
        <TabButton
          name={t`Highlights`}
          icon={<SparklesIcon className="h-4 w-4" />}
          active={feedType === 'HIGHLIGHTS'}
          showOnSm={false}
          onClick={() => {
            setFeedType('HIGHLIGHTS');
            Mixpanel.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS);
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
