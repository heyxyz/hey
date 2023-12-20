import type { ChangeEvent, FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useTimelineFilterStore } from 'src/store/persisted/useTimelineFilterStore';

const FeedEventFilters: FC = () => {
  const feedEventFilters = useTimelineFilterStore(
    (state) => state.feedEventFilters
  );
  const setFeedEventFilters = useTimelineFilterStore(
    (state) => state.setFeedEventFilters
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedEventFilters({
      ...feedEventFilters,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="outline-brand-500 rounded-md p-1 hover:bg-gray-300/20">
        <Tooltip content="Filter" placement="top">
          <AdjustmentsVerticalIcon className="text-brand-500 size-5" />
        </Tooltip>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              checked={feedEventFilters.posts}
              label="Show Posts"
              name="posts"
              onChange={handleChange}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              checked={feedEventFilters.mirrors}
              label="Show Mirrors"
              name="mirrors"
              onChange={handleChange}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              checked={feedEventFilters.likes}
              label="Show Likes"
              name="likes"
              onChange={handleChange}
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default FeedEventFilters;
