import { algorithms } from '@lenster/data/algorithms';
import type { HomeFeedType } from '@lenster/data/enums';
import { MISCELLANEOUS } from '@lenster/data/tracking';
import { TabButton } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC } from 'react';
import { useEnabledAlgorithmsPersistStore } from 'src/store/enabled-algorithms';

interface FeedTypeProps {
  setFeedType: Dispatch<HomeFeedType>;
  feedType: HomeFeedType;
}

const Tabs: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const enabledAlgorithms = useEnabledAlgorithmsPersistStore(
    (state) => state.enabledAlgorithms
  );

  return (
    <div className="flex flex-wrap gap-3 sm:px-0">
      {enabledAlgorithms.map((algo: HomeFeedType) => {
        const algorithm = algorithms.find((a) => a.feedType === algo);

        if (!algorithm) {
          return null;
        }

        return (
          <TabButton
            key={algorithm.name}
            name={algorithm.name}
            icon={
              <img
                className="h-4 w-4 rounded"
                src={algorithm.image}
                alt={algorithm.name}
              />
            }
            active={feedType === algorithm.feedType}
            showOnSm
            onClick={() => {
              setFeedType(algorithm.feedType as HomeFeedType);
              Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
            }}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
