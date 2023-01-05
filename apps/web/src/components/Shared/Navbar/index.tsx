import MessageIcon from '@components/Messages/MessageIcon';
import NotificationIcon from '@components/Notification/NotificationIcon';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Disclosure } from '@headlessui/react';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import hasPrideLogo from '@lib/hasPrideLogo';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile } from 'lens';
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
    router.push(`/u/${formatHandle(profile?.handle)}`);
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
        <NavItem url="/" name={t`Home`} current={pathname == '/'} />
        <NavItem url="/explore" name={t`Explore`} current={pathname == '/explore'} />
        <MoreNavItems />
      </>
    );
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-10 w-full bg-white border-b dark:bg-black dark:border-b-gray-700"
    >
      {({ open }) => (
        <>
          {staffMode && <StaffBar />}
          <div className="container px-5 mx-auto max-w-screen-xl">
            <div className="flex relative justify-between items-center h-14 sm:h-16">
              <div className="flex justify-start items-center">
                <Disclosure.Button className="inline-flex justify-center items-center text-gray-500 rounded-md md:hidden focus:outline-none">
                  {open ? <XIcon className="w-6 h-6" /> : <SearchIcon className="w-6 h-6" />}
                </Disclosure.Button>
                <Link href="/" className="hidden md:block">
                  <img
                    className="w-8 h-8"
                    height={32}
                    width={32}
                    src={currentProfile && hasPrideLogo(currentProfile) ? '/pride.svg' : '/logo.svg'}
                    alt="Logo"
                  />
                </Link>
                <div className="hidden md:block sm:ml-6">
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                      <Search onProfileSelected={onProfileSelected} />
                    </div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <Link href="/" className={clsx('md:hidden', !currentProfile?.id && 'ml-14')}>
                <img
                  className="w-7 h-7"
                  height={32}
                  width={32}
                  src={currentProfile && hasPrideLogo(currentProfile) ? '/pride.svg' : '/logo.svg'}
                  alt="Logo"
                />
              </Link>
              <div className="flex gap-4 items-center">
                {currentProfile ? (
                  <>
                    <MessageIcon />
                    <NotificationIcon />
                  </>
                ) : null}
                <MenuItems />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="m-3">
              <Search hideDropdown onProfileSelected={onProfileSelected} />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
