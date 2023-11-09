import { Menu } from '@headlessui/react';
import formatAddress from '@hey/lib/formatAddress';
import getProfile from '@hey/lib/getProfile';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import type { FC } from 'react';
import useEnsName from 'src/hooks/useEnsName';
import { useAppStore } from 'src/store/useAppStore';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import AppVersion from './NavItems/AppVersion';
import Logout from './NavItems/Logout';
import ThemeSwitch from './NavItems/ThemeSwitch';

const WalletUser: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const currentSessionProfileId = getCurrentSessionProfileId();
  const { ens } = useEnsName({
    address: currentSessionProfileId,
    enabled: Boolean(currentSessionProfileId)
  });

  const Avatar = () => (
    <Image
      src={getStampFyiURL(currentSessionProfileId)}
      className="h-8 w-8 cursor-pointer rounded-full border dark:border-gray-700"
      alt={currentSessionProfileId}
    />
  );

  return (
    <Menu as="div" className="hidden md:block">
      <Menu.Button className="outline-brand-500 flex self-center rounded-full">
        <Avatar />
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
        >
          <Menu.Item
            as={NextLink}
            href={getProfile(currentProfile).link}
            className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <div className="flex w-full flex-col">
              <div>Logged in as</div>
              <div className="truncate">
                <Slug className="font-bold" slug={formatAddress(ens)} />
              </div>
            </div>
          </Menu.Item>
          <div className="divider" />
          <Menu.Item
            as="div"
            className={({ active }) =>
              cn({ 'dropdown-active': active }, 'm-2 rounded-lg')
            }
          >
            <Logout />
          </Menu.Item>
          <div className="divider" />
          <Menu.Item
            as="div"
            className={({ active }) =>
              cn({ 'dropdown-active': active }, 'm-2 rounded-lg')
            }
          >
            <ThemeSwitch />
          </Menu.Item>
          <div className="divider" />
          <AppVersion />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default WalletUser;
