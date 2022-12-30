import { Menu } from '@headlessui/react';
import { HandIcon, SupportIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment } from 'react';

import MenuTransition from '../MenuTransition';
import { NextLink } from './MenuItems';

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
                as={NextLink}
                href="/contact"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <SupportIcon className="w-4 h-4" />
                  <div>
                    <Trans>Contact</Trans>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Item
                as="a"
                href="https://github.com/lensterxyz/lenster/issues/new?assignees=bigint&labels=needs+review&template=bug_report.yml"
                target="_blank"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <HandIcon className="w-4 h-4" />
                  <div>
                    <Trans>Report a bug</Trans>
                  </div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
