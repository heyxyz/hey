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
  setIsAlgorithmicFeed: Dispatch<boolean>;
}

const Tabs: FC<FeedTypeProps> = ({
  setFeedType,
  feedType,
  setIsAlgorithmicFeed
}) => {
  const enabledAlgorithms = useEnabledAlgorithmsPersistStore(
    (state) => state.enabledAlgorithms
  );

  return (
    <>
      {enabledAlgorithms.map((algo: HomeFeedType) => {
        const algorithm = algorithms.find((a) => a.feedType === algo);

        return (
          <TabButton
            key={algorithm?.name}
            name={algorithm?.name as string}
            icon={
              <img
                className="h-4 w-4 rounded"
                src={algorithm?.image}
                alt={algorithm?.name}
              />
            }
            active={feedType === algorithm?.feedType}
            showOnSm={false}
            onClick={() => {
              setFeedType(algorithm?.feedType as HomeFeedType);
              setIsAlgorithmicFeed(true);
              Leafwatch.track(MISCELLANEOUS.SWITCH_HIGHLIGHTS_FEED);
            }}
          />
        );
      })}
    </>
  );
};

export default Tabs;
