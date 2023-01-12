import { Menu } from '@headlessui/react';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment } from 'react';

import MenuTransition from '../MenuTransition';
import Contact from './NavItems/Contact';
import ReportBug from './NavItems/ReportBug';

const MoreNavItems: FC = () => {
  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              'w-full text-left px-2 md:px-3 py-1 rounded-md font-bold cursor-pointer text-sm tracking-wide',
              {
                'text-black dark:text-white bg-gray-200 dark:bg-gray-800': open,
                'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                  !open
              }
            )}
          >
            <Trans>More</Trans>
          </Menu.Button>
          <MenuTransition>
            <Menu.Items
              static
              className="absolute py-1 mt-2 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700"
            >
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'm-2 rounded-lg')
                }
              >
                <Contact />
              </Menu.Item>
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'm-2 rounded-lg')
                }
              >
                <ReportBug />
              </Menu.Item>
            </Menu.Items>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
