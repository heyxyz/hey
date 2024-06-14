import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import cn from '@good/ui/cn';
import {
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  HomeIcon as HomeIconOutline,
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid
} from '@heroicons/react/24/solid';

import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const NavbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;

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
    bottom: 80px;  /* Adjust this value to raise the button */
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
    name: string;
    url: string;
    icon: ReactNode;
  }

  const NavItem: FC<NavItemProps> = ({ current, name, url, icon }) => {
    return (
      <Link
        className={cn(
          'cursor-pointer rounded-md px-2 py-1 mb-4 flex items-start space-x-2 hover:bg-gray-300/20 md:flex',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white': !current
          }
        )}
        href={url}
      >
        {icon}
        <div className="nav-text dark:text-white text-black">
          <span className={`text-xl ${current ? 'font-bold' : ''}`}>{name}</span>
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
          name="Home"
          url="/" 
          icon={pathname === '/' ? <HomeIconSolid className="size-8" /> : <HomeIconOutline className="size-8" />}
        />
        <NavItem
          current={pathname === '/explore'}
          name="Explore"
          url="/explore"
          icon={pathname === '/explore' ? <MagnifyingGlassIconSolid className="size-8" /> : <MagnifyingGlassIconOutline className="size-8" />}
        />
        <NavItem 
          current={pathname === '/notifications'} 
          name="Notifications"
          url="/notifications" 
          icon={pathname === '/notifications' ? <BellIconSolid className="size-8" /> : <BellIconOutline className="size-8" />}
        />
        <NavItem 
          current={pathname === '/messages'} 
          name="Messages"
          url="/messages" 
          icon={pathname === '/messages' ? <EnvelopeIconSolid className="size-8" /> : <EnvelopeIconOutline className="size-8" />}
        />
        <NavItem 
          current={pathname === '/more'} 
          name="More"
          url="/more" 
          icon={<EllipsisHorizontalIcon className="size-8" />}
        />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      {staffMode ? <StaffBar /> : null}
      <NavbarContainer className="container mx-auto max-w-screen-xl">
        <div className="relative flex flex-col h-full items-start justify-start">
          <button
            className="inline-flex items-start justify-start rounded-md text-gray-500 focus:outline-none md:hidden hide-on-mobile"
            onClick={() => setShowSearch(!showSearch)}
            type="button"
          >
            {showSearch ? (
              <XMarkIconSolid className="size-6" />
            ) : (
              <MagnifyingGlassIconSolid className="size-8" />
            )}
          </button>
          <Link href="/" className="hide-on-mobile">
            <div className="inline-flex flex-grow justify-start items-start font-bold text-white-900">
              <div className="text-3xl font-black ml-6">
                <img className="w-12 h-12" src="/logo1.svg" alt="Logo" />
              </div>
              <span className="nav-text flex flex-grow ml-3 mr-3">Goodcast</span>
            </div>
          </Link>
          <div className="hidden sm:ml-6 md:block pt-5 overflow-y-auto max-h-[70vh] pr-4">
            <div className="flex flex-col items-start relative h-fit">
              <NavItems />
              <div className="w-full mt-5 desktop-post-button">
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
