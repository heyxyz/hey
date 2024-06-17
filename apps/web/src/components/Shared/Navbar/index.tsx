import type { FC, ReactNode } from 'react';

import Search from '@components/Search';
import cn from '@good/ui/cn';
import {
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import styled from 'styled-components';

import MoreNavItems from './MoreNavItems';
import StaffBar from './StaffBar';

const NavbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  margin: 0;
  padding: 0;

  @media (max-width: 1024px) {
    .nav-text,
    .auth-buttons {
      display: none;
    }
  }

  @media (max-width: 430px) {
    .hide-on-mobile {
      display: none;
    }
  }
`;

const BottomButtonsContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const PostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #da5597;
  color: white;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;

  @media (max-width: 430px) {
    display: none;
  }
`;

const MobilePostButton = styled.button`
  display: none;

  @media (max-width: 430px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #da5597;
    color: white;
    width: 56px;
    height: 56px;
    position: fixed;
    bottom: 80px; /* Adjust this value to raise the button */
    right: 20px;
    z-index: 10;
    font-size: 2rem;
  }
`;

const SignupButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: black;
  color: white;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid black;
  background-color: white;
  color: black;
  width: 100%;
  padding: 0.25rem;
  font-size: 0.875rem;
`;

const Navbar: FC = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();
  const { appIcon } = usePreferencesStore();
  const [showSearch, setShowSearch] = useState(false);
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsShortScreen(window.innerHeight < 500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  interface NavItemProps {
    current: boolean;
    icon: ReactNode;
    name: string;
    url: string;
  }

  const NavItem: FC<NavItemProps> = ({ current, icon, name, url }) => {
    return (
      <Link
        className={cn(
          'mb-4 flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        href={url}
      >
        {icon}
        <div className="nav-text text-black dark:text-white">
          <span className={`text-xl ${current ? 'font-bold' : ''}`}>
            {name}
          </span>
        </div>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();
    return (
      <>
        <NavItem
          current={pathname === '/'}
          icon={
            pathname === '/' ? (
              <HomeIconSolid className="size-8" />
            ) : (
              <HomeIconOutline className="size-8" />
            )
          }
          name="Home"
          url="/"
        />
        <NavItem
          current={pathname === '/explore'}
          icon={
            pathname === '/explore' ? (
              <MagnifyingGlassIconSolid className="size-8" />
            ) : (
              <MagnifyingGlassIconOutline className="size-8" />
            )
          }
          name="Explore"
          url="/explore"
        />
        <NavItem
          current={pathname === '/notifications'}
          icon={
            pathname === '/notifications' ? (
              <BellIconSolid className="size-8" />
            ) : (
              <BellIconOutline className="size-8" />
            )
          }
          name="Notifications"
          url="/notifications"
        />
        <NavItem
          current={pathname === '/messages'}
          icon={
            pathname === '/messages' ? (
              <EnvelopeIconSolid className="size-8" />
            ) : (
              <EnvelopeIconOutline className="size-8" />
            )
          }
          name="Messages"
          url="/messages"
        />
        <div className="relative">
          <MoreNavItems />
        </div>
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      {staffMode ? <StaffBar /> : null}
      <NavbarContainer className="container mx-auto max-w-screen-xl">
        <div className="relative flex h-full flex-col items-start justify-start">
          <button
            className="hide-on-mobile inline-flex items-start justify-start rounded-md text-gray-500 focus:outline-none md:hidden"
            onClick={() => setShowSearch(!showSearch)}
            type="button"
          >
            {showSearch ? (
              <XMarkIconSolid className="size-6" />
            ) : (
              <MagnifyingGlassIconSolid className="size-8" />
            )}
          </button>
          <Link className="hide-on-mobile" href="/">
            <div className="text-white-900 inline-flex flex-grow items-start justify-start font-bold">
              <div className="ml-6 text-3xl font-black">
                <img alt="Logo" className="h-12 w-12" src="/logo1.svg" />
              </div>
              <span className="nav-text ml-3 mr-3 flex flex-grow">
                Goodcast
              </span>
            </div>
          </Link>
          <div className="hidden max-h-[70vh] overflow-y-auto pr-4 pt-5 sm:ml-6 md:block">
            <div className="relative flex h-fit flex-col items-start">
              <NavItems />
              <div className="desktop-post-button mt-5 w-full">
                <PostButton>Post</PostButton>
                <div className="auth-buttons">
                  <Link href="/signup">
                    <SignupButton>Signup</SignupButton>
                  </Link>
                  <Link href="/login">
                    <LoginButton>Login</LoginButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavbarContainer>
      <MobilePostButton className="mobile-post-button">+</MobilePostButton>
      {showSearch ? (
        <div className="m-3 md:hidden">
          <Search />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
