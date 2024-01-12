import type { HomeFeedType } from '@hey/data/enums';
import type { Dispatch, FC, SetStateAction } from 'react';

import { algorithms } from '@hey/data/algorithms';
import { HOME } from '@hey/data/tracking';
import { TabButton } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEnabledAlgorithmsStore } from 'src/store/persisted/useEnabledAlgorithmsStore';

interface FeedTypeProps {
  feedType: HomeFeedType;
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
}

const Tabs: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const enabledAlgorithms = useEnabledAlgorithmsStore(
    (state) => state.enabledAlgorithms
  );
  const sanitizedEnabledAlgorithms = algorithms.filter((a) => {
    return enabledAlgorithms.includes(a.feedType);
  });

  if (sanitizedEnabledAlgorithms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 sm:px-0">
      {sanitizedEnabledAlgorithms.map((algorithm) => {
        return (
          <TabButton
            active={feedType === algorithm.feedType}
            icon={
              <img
                alt={algorithm.name}
                className="size-4 rounded"
                src={algorithm.image}
              />
            }
            key={algorithm.feedType}
            name={algorithm.name}
            onClick={() => {
              setFeedType(algorithm.feedType as HomeFeedType);
              Leafwatch.track(HOME.ALGORITHMS.SWITCH_ALGORITHMIC_FEED, {
                algorithm: algorithm.feedType
              });
            }}
            showOnSm
          />
        );
      })}
    </div>
  );
};

export default Tabs;
