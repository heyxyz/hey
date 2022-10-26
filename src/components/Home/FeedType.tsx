import TabButton from '@components/UI/TabButton';
import { SparklesIcon, ViewListIcon } from '@heroicons/react/outline';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Dispatch, FC } from 'react';
import { useAppStore } from 'src/store/app';

import FeedEventFilters from './FeedEventFilters';

interface Props {
  setFeedType: Dispatch<'TIMELINE' | 'HIGHLIGHTS'>;
  feedType: 'TIMELINE' | 'HIGHLIGHTS';
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="flex flex-wrap items-center md:px-0 px-1 justify-between">
      <div className="flex overflow-x-auto gap-3 sm:px-0">
        <TabButton
          name="Timeline"
          icon={<ViewListIcon className="w-4 h-4" />}
          active={feedType === 'TIMELINE'}
          showOnSm
          onClick={() => setFeedType('TIMELINE')}
        />
        <TabButton
          name="Highlights"
          icon={<SparklesIcon className="w-4 h-4" />}
          active={feedType === 'HIGHLIGHTS'}
          showOnSm
          onClick={() => setFeedType('HIGHLIGHTS')}
        />
      </div>
      {feedType === 'TIMELINE' && isFeatureEnabled('timeline-v2', currentProfile?.id) && <FeedEventFilters />}
    </div>
  );
};

export default FeedType;
