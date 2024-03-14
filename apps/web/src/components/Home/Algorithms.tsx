import type { HomeFeedType } from '@hey/data/enums';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { algorithms } from '@hey/data/algorithms';
import { HOME } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';

const Algorithms: FC = () => {
  const { query, replace } = useRouter();
  const feedType = (query.type as string)?.toUpperCase() as HomeFeedType;

  const shallowReplace = (type: HomeFeedType) => {
    replace({ query: { ...query, type: type.toLowerCase() } }, undefined, {
      shallow: true
    });
  };

  return (
    <Menu as="div" className="relative">
      <>
        <Menu.Button
          className="rounded-md p-1 hover:bg-gray-300/20"
          onClick={() => {
            Leafwatch.track(HOME.ALGORITHMS.OPEN_ALGORITHMS);
          }}
        >
          <SparklesIcon className="size-5" />
        </Menu.Button>
        <MenuTransition>
          <Menu.Items
            className="absolute right-0 z-[5] mt-1 w-52 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            {algorithms.map((algorithm) => (
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  cn({ 'dropdown-active': active }, 'm-2 rounded-lg')
                }
                key={algorithm.name}
              >
                <button
                  className="flex w-full items-center justify-between px-2 py-1.5"
                  onClick={() => {
                    shallowReplace(algorithm.feedType as HomeFeedType);
                    Leafwatch.track(HOME.ALGORITHMS.SWITCH_ALGORITHMIC_FEED, {
                      algorithm: algorithm.feedType
                    });
                  }}
                >
                  <div className="flex items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200">
                    <img
                      alt={algorithm.name}
                      className="size-4 rounded"
                      src={algorithm.image}
                    />
                    <div>{algorithm.name}</div>
                  </div>
                  {feedType === algorithm.feedType && (
                    <CheckCircleIcon className="size-4" />
                  )}
                </button>
              </Menu.Item>
            ))}
          </Menu.Items>
        </MenuTransition>
      </>
    </Menu>
  );
};

export default Algorithms;
