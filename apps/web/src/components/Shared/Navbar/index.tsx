import MessageIcon from '@components/Messages/MessageIcon';
import NotificationIcon from '@components/Notification/NotificationIcon';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Disclosure } from '@headlessui/react';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { DISCORD_URL } from 'data/constants';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import hasPrideLogo from 'lib/hasPrideLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import MenuItems from './MenuItems';
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
    newTab?: boolean;
  }

  const NavItem = ({ url, name, current, newTab }: NavItemProps) => {
    return (
      <Link
        href={url}
        aria-current={current ? 'page' : undefined}
        data-testid={`nav-item-${name.toLowerCase()}`}
        className={clsx('px-2 py-1 text-left uppercase tracking-wide md:px-3', {
          'text-brand-500': current,
          'hover:text-brand-500': !current
        })}
        target={newTab ? '_blank' : ''}
        rel={newTab ? 'noopener noreferrer' : ''}
      >
        {name}
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem url="/" name={t`Home`} current={pathname === '/'} />
        <NavItem url="/explore" name={t`Explore`} current={pathname === '/explore'} />
        <NavItem url={DISCORD_URL} name={t`Contact`} current={pathname === '/contact'} newTab />
      </>
    );
  };

  const Headline = () => (
    <>
      {currentProfile && hasPrideLogo(currentProfile) && (
        <img className="h-8 w-8" height={32} width={32} src="/pride.svg" alt="Pride" />
      )}
      <h2 className="text-3xl font-medium">Lineaster</h2>
    </>
  );

  return (
    <Disclosure as="header" className="bg-darker sticky top-0 z-10 w-full text-white">
      {({ open }) => (
        <>
          {staffMode && <StaffBar />}
          <div className="container mx-auto max-w-screen-xl px-5">
            <div className="relative flex h-14 items-center justify-between sm:h-16">
              <div className="flex items-center justify-start">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md text-gray-500 focus:outline-none md:hidden">
                  {open ? <XIcon className="h-6 w-6" /> : <SearchIcon className="h-6 w-6" />}
                </Disclosure.Button>
                <Link href="/" className="hidden md:block">
                  <Headline />
                </Link>
                <div className="hidden sm:ml-6 md:block">
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                      <Search onProfileSelected={onProfileSelected} />
                    </div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <Link href="/" className={clsx('md:hidden', !currentProfile?.id && 'ml-[60px]')}>
                <Headline />
              </Link>
              <div className="flex items-center gap-4">
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

          <Disclosure.Panel className="md:hidden">
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
