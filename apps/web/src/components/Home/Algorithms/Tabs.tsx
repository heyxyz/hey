import { algorithms } from '@lenster/data/algorithms';
import type { HomeFeedType } from '@lenster/data/enums';
import { HOME } from '@lenster/data/tracking';
import { TabButton } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { For } from 'million/react';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEnabledAlgorithmsPersistStore } from 'src/store/enabled-algorithms';

interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  feedType: HomeFeedType;
}

const Tabs: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const enabledAlgorithms = useEnabledAlgorithmsPersistStore(
    (state) => state.enabledAlgorithms
  );
  const sanitizedEnabledAlgorithms = algorithms.filter((a) => {
    return enabledAlgorithms.includes(a.feedType);
  });

  if (sanitizedEnabledAlgorithms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap sm:px-0 [&>*]:gap-3">
      <For each={sanitizedEnabledAlgorithms} as="div">
        {(algorithm) => (
          <TabButton
            key={algorithm.feedType}
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
              Leafwatch.track(HOME.ALGORITHMS.SWITCH_ALGORITHMIC_FEED, {
                algorithm: algorithm.feedType
              });
            }}
          />
        )}
      </For>
    </div>
  );
};

export default Tabs;
