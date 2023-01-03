import MenuTransition from '@components/Shared/MenuTransition';
import { Checkbox } from '@components/UI/Checkbox';
import { Tooltip } from '@components/UI/Tooltip';
import { Menu } from '@headlessui/react';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { ChangeEvent } from 'react';
import { useProfileFeedStore } from 'src/store/profile-feed';

const MediaFilter = () => {
  const mediaFeedFilters = useProfileFeedStore((state) => state.mediaFeedFilters);
  const setMediaFeedFilters = useProfileFeedStore((state) => state.setMediaFeedFilters);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMediaFeedFilters({ ...mediaFeedFilters, [e.target.name]: e.target.checked });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md hover:bg-gray-300 hover:bg-opacity-20">
        <Tooltip placement="top" content="Filter">
          <AdjustmentsIcon className="w-5 h-5 text-brand" />
        </Tooltip>
      </Menu.Button>
      <MenuTransition>
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
              checked={mediaFeedFilters.images}
              name="images"
              label={t`Images`}
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
              checked={mediaFeedFilters.video}
              name="video"
              label={t`Video`}
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
