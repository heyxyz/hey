import type { FC } from 'react';

import { GlobeAmericasIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { algorithms } from '@hey/data/algorithms';
import { HOME } from '@hey/data/tracking';
import { Toggle, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useEnabledAlgorithmsStore } from 'src/store/persisted/useEnabledAlgorithmsStore';

const List: FC = () => {
  const enabledAlgorithms = useEnabledAlgorithmsStore(
    (state) => state.enabledAlgorithms
  );
  const enableAlgorithm = useEnabledAlgorithmsStore(
    (state) => state.enableAlgorithm
  );
  const disableAlgorithm = useEnabledAlgorithmsStore(
    (state) => state.disableAlgorithm
  );

  return (
    <div className="divide-y-[1px] dark:divide-gray-700">
      {algorithms.map((algorithm) => (
        <div
          className="flex items-center justify-between p-5"
          key={algorithm.feedType}
        >
          <div className="mr-5 space-y-2">
            <div className="flex items-center space-x-2">
              <img
                alt={algorithm.name}
                className="size-10 rounded-lg"
                src={algorithm.image}
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <b>{algorithm.name}</b>
                  <Tooltip
                    content={
                      algorithm.isPersonalized ? 'Personalized' : 'Global'
                    }
                    placement="top"
                  >
                    <div className="text-brand-500">
                      {algorithm.isPersonalized ? (
                        <UserCircleIcon className="size-4" />
                      ) : (
                        <GlobeAmericasIcon className="size-4" />
                      )}
                    </div>
                  </Tooltip>
                </div>
                <div className="text-sm">by {algorithm.by}</div>
              </div>
            </div>
            <div className="ld-text-gray-500 max-w-sm text-sm">
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
