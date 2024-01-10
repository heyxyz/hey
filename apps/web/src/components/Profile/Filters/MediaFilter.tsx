import type { ChangeEvent } from 'react';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox, Tooltip } from '@hey/ui';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useCallback } from 'react';
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

  const onSelectDropdownItem = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-md hover:bg-gray-300/20">
          <Tooltip content="Filter" placement="top">
            <AdjustmentsVerticalIcon className="text-brand-500 size-5" />
          </Tooltip>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="menu-transition absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
        <DropdownMenu.Item
          className={
            'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800'
          }
          onSelect={onSelectDropdownItem}
        >
          <Checkbox
            checked={mediaFeedFilters.images}
            label="Images"
            name="images"
            onChange={handleChange}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={
            'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800'
          }
          onSelect={onSelectDropdownItem}
        >
          <Checkbox
            checked={mediaFeedFilters.video}
            label="Video"
            name="video"
            onChange={handleChange}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={
            'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800'
          }
          onSelect={onSelectDropdownItem}
        >
          <Checkbox
            checked={mediaFeedFilters.audio}
            label="Audio"
            name="audio"
            onChange={handleChange}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MediaFilter;
