import type { FC } from 'react';

import cn from '@hey/ui/cn';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Bookmarks from './NavItems/Bookmarks';
import Support from './NavItems/Support';

const MoreNavItems: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root modal={false} onOpenChange={setOpen} open={open}>
      <div>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              'outline-brand-500 w-full cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
              {
                'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': open,
                'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
                  !open
              }
            )}
          >
            More
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="start"
          className="radix-transition absolute mt-2 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {currentProfile ? (
            <>
              <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
                <Bookmarks />
              </DropdownMenu.Item>
              <div className="divider" />
            </>
          ) : null}
          <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
            <Support />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </div>
    </DropdownMenu.Root>
  );
};

export default MoreNavItems;
