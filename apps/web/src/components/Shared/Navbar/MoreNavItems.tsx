import type { FC } from 'react';

import cn from '@good/ui/cn';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MenuTransition from '../MenuTransition';
import Bookmarks from './NavItems/Bookmarks';
import MoreLink from './NavItems/MoreLink';
import Support from './NavItems/Support';

const MoreNavItems: FC = () => {
  const { currentProfile } = useProfileStore();

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton
            className={cn(
              'flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm tracking-wide md:px-3',
              {
                'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': open,
                'text-white-700 dark:text-white-300 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white':
                  !open
              }
            )}
          >
            <EllipsisHorizontalCircleIcon className="ml-[-3px] size-8" />
            <span className="text-xl">More</span>
          </MenuButton>
          <MenuTransition>
            <MenuItems
              className="absolute bottom-full mb-2 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
              static
            >
              {currentProfile ? (
                <>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <Bookmarks />
                  </MenuItem>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <MoreLink href="https://gitcoin.co" text="Gitcoin" />
                  </MenuItem>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <MoreLink href="https://giveth.io" text="Giveth" />
                  </MenuItem>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <MoreLink
                      href="https://thegivingblock.com"
                      text="The Giving Block"
                    />
                  </MenuItem>
                  <div className="divider" />
                </>
              ) : null}
              <MenuItem
                as="div"
                className={({ focus }: { focus: boolean }) =>
                  cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                }
              >
                <Support />
              </MenuItem>
            </MenuItems>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
