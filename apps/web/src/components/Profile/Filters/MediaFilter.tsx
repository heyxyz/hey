import type { ChangeEvent } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useProfileFeedStore } from 'src/store/non-persisted/useProfileFeedStore';

const MediaFilter = () => {
  const mediaFeedFilters = useProfileFeedStore(
    (state) => state.mediaFeedFilters
  );
  const setMediaFeedFilters = useProfileFeedStore(
    (state) => state.setMediaFeedFilters
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMediaFeedFilters({
      ...mediaFeedFilters,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300/20">
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
              checked={mediaFeedFilters.images}
              label="Images"
              name="images"
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
              checked={mediaFeedFilters.video}
              label="Video"
              name="video"
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
              checked={mediaFeedFilters.audio}
              label="Audio"
              name="audio"
              onChange={handleChange}
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default MediaFilter;
