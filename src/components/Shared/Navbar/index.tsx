import NotificationIcon from '@components/Notification/Icon';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import type { Profile } from '@generated/types';
import { Disclosure } from '@headlessui/react';
import { MailIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import hasPrideLogo from '@lib/hasPrideLogo';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { allowed: staffMode } = useStaffMode();
  const router = useRouter();

  const onProfileSelected = (profile: Profile) => {
    router.push(`/u/${profile?.handle}`);
  };

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
            'w-full text-left px-2 md:px-3 py-1 rounded-md font-bold cursor-pointer text-sm tracking-wide',
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
      as="header"
      className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          {staffMode && <StaffBar />}
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
                <Link href="/">
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
                      <Search onProfileSelected={onProfileSelected} />
                    </div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                {currentProfile ? (
                  <>
                    {isFeatureEnabled('messages', currentProfile?.id) && (
                      <Link href="/messages" className="rounded-md hover:bg-gray-300 p-1 hover:bg-opacity-20">
                        <MailIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </Link>
                    )}
                    <NotificationIcon />
                  </>
                ) : null}
                <MenuItems />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <div className="mb-2">
                <Search hideDropdown onProfileSelected={onProfileSelected} />
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
