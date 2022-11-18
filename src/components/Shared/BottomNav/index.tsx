import MessageIcon from '@components/Messages/MessageIcon';
import NotificationIcon from '@components/Notification/NotificationIcon';
import { Disclosure } from '@headlessui/react';
import { GlobeIcon, HomeIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const BottomNav: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  interface NavItemProps {
    url: string;
    name: string;
    icon: JSX.Element;
    current: boolean;
  }

  const NavItem = ({ url, icon, current }: NavItemProps) => {
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
          {icon}
        </Disclosure.Button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem
          url="/"
          name="Home"
          icon={<HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          current={pathname == '/'}
        />
        <NavItem
          url="/explore"
          name="Explore"
          icon={<GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          current={pathname == '/explore'}
        />
      </>
    );
  };

  return (
    //shows when users login and hidden above lg width
    <Disclosure
      as="div"
      className="lg:hidden sticky bottom-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {currentProfile ? (
        <div className="container px-5 mx-auto max-w-screen-xl">
          <div className="flex relative justify-between items-center h-14 sm:h-16">
            <NavItems />
            <MessageIcon />
            <NotificationIcon />
          </div>
        </div>
      ) : (
        null
      )}
    </Disclosure>
  );
};

export default BottomNav;
