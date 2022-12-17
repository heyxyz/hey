import { Checkbox } from '@components/UI/Checkbox';
import { Tooltip } from '@components/UI/Tooltip';
import { Menu, Transition } from '@headlessui/react';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { ChangeEvent, FC } from 'react';
import React, { Fragment } from 'react';
import { useTimelinePersistStore } from 'src/store/timeline';

const FeedEventFilters: FC = () => {
  const feedEventFilters = useTimelinePersistStore((state) => state.feedEventFilters);
  const setFeedEventFilters = useTimelinePersistStore((state) => state.setFeedEventFilters);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedEventFilters({ ...feedEventFilters, [e.target.name]: e.target.checked });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20">
        <Tooltip placement="top" content="Filter">
          <AdjustmentsIcon className="w-5 h-5 text-brand" />
        </Tooltip>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute right-0 py-1 z-[5] mt-1 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700"
        >
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.posts}
              name="posts"
              label="Show Posts"
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.mirrors}
              name="mirrors"
              label="Show Mirrors"
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.likes}
              name="likes"
              label="Show Likes"
            />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FeedEventFilters;
