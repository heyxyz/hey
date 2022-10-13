import TabButton from '@components/UI/TabButton';
import { SparklesIcon, ViewListIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

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
          Leafwatch.track(MISCELLANEOUS.SWITCH_TIMELINE);
        }}
      />
      <TabButton
        name="Highlights"
        icon={<SparklesIcon className="w-4 h-4" />}
        active={feedType === 'HIGHLIGHTS'}
        showOnSm
        onClick={() => {
          setFeedType('HIGHLIGHTS');
          Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS);
        }}
      />
    </div>
  );
};

export default FeedType;
