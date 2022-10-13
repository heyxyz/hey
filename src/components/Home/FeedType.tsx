import TabButton from '@components/UI/TabButton';
import { SparklesIcon, ViewListIcon } from '@heroicons/react/outline';
import type { Dispatch, FC } from 'react';

interface Props {
  setFeedType: Dispatch<'TIMELINE' | 'HIGHLIGHTS'>;
  feedType: 'TIMELINE' | 'HIGHLIGHTS';
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  return (
    <div className="flex overflow-x-auto gap-3 px-5 sm:px-0">
      <TabButton
        name="Timeline"
        icon={<ViewListIcon className="w-4 h-4" />}
        active={feedType === 'TIMELINE'}
        showOnSm
        onClick={() => {
          setFeedType('TIMELINE');
          // Leafwatch.track(PROFILE.SWITCH_FEED);
        }}
      />
      <TabButton
        name="Highlights"
        icon={<SparklesIcon className="w-4 h-4" />}
        active={feedType === 'HIGHLIGHTS'}
        showOnSm
        onClick={() => {
          setFeedType('HIGHLIGHTS');
          // Leafwatch.track(PROFILE.SWITCH_REPLIES);
        }}
      />
    </div>
  );
};

export default FeedType;
