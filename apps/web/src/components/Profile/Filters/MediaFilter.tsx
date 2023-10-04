import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { t } from '@lingui/macro';
import type { ChangeEvent } from 'react';
import { useProfileFeedStore } from 'src/store/profile-feed';

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
        <Tooltip placement="top" content={t`Filter`}>
          <AdjustmentsVerticalIcon className="text-brand h-5 w-5" />
        </Tooltip>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
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
              onChange={handleChange}
              checked={mediaFeedFilters.images}
              name="images"
              label={t`Images`}
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
              onChange={handleChange}
              checked={mediaFeedFilters.video}
              name="video"
              label={t`Video`}
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
              onChange={handleChange}
              checked={mediaFeedFilters.audio}
              name="audio"
              label={t`Audio`}
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default MediaFilter;
