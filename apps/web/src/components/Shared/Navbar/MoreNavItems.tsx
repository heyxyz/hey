import { Menu } from '@headlessui/react';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';

import MenuTransition from '../MenuTransition';
import Contact from './NavItems/Contact';
import ReportBug from './NavItems/ReportBug';

const MoreNavItems: FC = () => {
  return (
    <Menu as="div" data-testid="nav-item-more">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx('w-full cursor-pointer px-2 py-1 uppercase md:px-3', {
              'text-brand-500': open,
              'hover:text-brand-500': !open
            })}
          >
            <Trans>More</Trans>
          </Menu.Button>
          <MenuTransition>
            <Menu.Items
              static
              className="bg-dark absolute mt-2 max-h-[80vh] overflow-y-auto rounded-[2px] border border-gray-500 uppercase text-white"
              data-testid="nav-item-more-dropdown"
            >
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) => clsx({ 'dropdown-active': active })}
              >
                <Contact className="bg-dark hover:bg-darker hover:text-brand-500 text-sm text-gray-300" />
              </Menu.Item>
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) => clsx({ 'dropdown-active': active })}
              >
                <ReportBug className="bg-dark hover:bg-darker hover:text-brand-500 text-sm text-gray-300" />
              </Menu.Item>
            </Menu.Items>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
