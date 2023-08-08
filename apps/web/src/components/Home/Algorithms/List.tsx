import { algorithms } from '@lenster/data/algorithms';
import { HOME } from '@lenster/data/tracking';
import { Toggle } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC } from 'react';
import { useEnabledAlgorithmsPersistStore } from 'src/store/enabled-algorithms';

const List: FC = () => {
  const enabledAlgorithms = useEnabledAlgorithmsPersistStore(
    (state) => state.enabledAlgorithms
  );
  const enableAlgorithm = useEnabledAlgorithmsPersistStore(
    (state) => state.enableAlgorithm
  );
  const disableAlgorithm = useEnabledAlgorithmsPersistStore(
    (state) => state.disableAlgorithm
  );

  return (
    <div className="divide-y-[1px] dark:divide-gray-700">
      {algorithms.map((algorithm) => (
        <div
          key={algorithm.feedType}
          className="flex items-center justify-between p-5"
        >
          <div className="mr-5 space-y-2">
            <div className="flex items-center space-x-2">
              <img
                className="h-10 w-10 rounded-lg"
                src={algorithm.image}
                alt={algorithm.name}
              />
              <div>
                <b>{algorithm.name}</b>
                <div className="text-sm">by {algorithm.by}</div>
              </div>
            </div>
            <div className="lt-text-gray-500 max-w-sm text-sm">
              {algorithm.description}
            </div>
          </div>
          <Toggle
            on={enabledAlgorithms.includes(algorithm.feedType)}
            setOn={() => {
              const enabled = enabledAlgorithms.includes(algorithm.feedType);
              if (!enabled) {
                enableAlgorithm(algorithm.feedType);
              } else {
                disableAlgorithm(algorithm.feedType);
              }
              Leafwatch.track(HOME.ALGORITHMS.TOGGLE_ALGORITHM, {
                algorithm: algorithm.feedType,
                enabled: !enabled
              });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default List;
