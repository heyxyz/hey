import { gql, useQuery } from '@apollo/client';
import NotificationIcon from '@components/Notification/Icon';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import hasPrideLogo from '@lib/hasPrideLogo';
import isStaff from '@lib/isStaff';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';

import NewPostModal from '../../Publication/New/NewPostModal';
import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

const PING_QUERY = gql`
  query Ping {
    ping
  }
`;

const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useAppPersistStore((state) => state.staffMode);

  const { data: pingData } = useQuery(PING_QUERY, {
    pollInterval: 3000,
    skip: !currentProfile
  });

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link href={url} aria-current={current ? 'page' : undefined}>
        <Disclosure.Button
          className={clsx(
            'w-full text-left px-2 md:px-3 py-1 rounded-md font-black cursor-pointer text-sm tracking-wide',
            {
              'text-black dark:text-white bg-gray-200 dark:bg-gray-800': current,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                !current
            }
          )}
        >
          {name}
        </Disclosure.Button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem url="/" name="Home" current={pathname == '/'} />
        <NavItem url="/explore" name="Explore" current={pathname == '/explore'} />
        <MoreNavItems />
      </>
    );
  };

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          {isStaff(currentProfile?.id) && staffMode && <StaffBar />}
          <div className="container px-5 mx-auto max-w-screen-xl">
            <div className="flex relative justify-between items-center h-14 sm:h-16">
              <div className="flex justify-start items-center">
                <Disclosure.Button className="inline-flex justify-center items-center mr-4 text-gray-500 rounded-md sm:hidden focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <Link href="/" className="text-3xl font-black">
                  <img
                    className="w-8 h-8"
                    height={32}
                    width={32}
                    src={currentProfile && hasPrideLogo(currentProfile) ? '/pride.svg' : '/logo.svg'}
                    alt="Logo"
                  />
                </Link>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">
                      <Search />
                    </div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <div className="flex gap-8 items-center">
                {currentProfile && <NewPostModal />}
                {currentProfile && <NotificationIcon />}
                <MenuItems pingData={pingData} />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <div className="mb-2">
                <Search hideDropdown />
              </div>
              <NavItems />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
