import NotificationIcon from "@components/Notification/NotificationIcon";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { H6 } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import MenuItems from "./MenuItems";
import MoreNavItems from "./MoreNavItems";
import Search from "./Search";
import StaffBar from "./StaffBar";

const Navbar: FC = () => {
  const { currentAccount } = useAccountStore();
  const { appIcon } = usePreferencesStore();
  const [showSearch, setShowSearch] = useState(false);

  interface NavItemProps {
    current: boolean;
    name: string;
    url: string;
  }

  const NavItem = ({ current, name, url }: NavItemProps) => {
    return (
      <Link
        className={cn(
          "cursor-pointer rounded-md px-2 py-1 text-left tracking-wide md:px-3",
          {
            "bg-gray-200 text-black dark:bg-gray-800 dark:text-white": current,
            "text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white":
              !current
          }
        )}
        href={url}
      >
        <H6>{name}</H6>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem current={pathname === "/"} name="Home" url="/" />
        <NavItem
          current={pathname === "/explore"}
          name="Explore"
          url="/explore"
        />
        <MoreNavItems />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      <StaffBar />
      <div className="container mx-auto max-w-screen-xl px-5">
        <div className="relative flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center justify-start">
            <button
              aria-label="Search"
              className="inline-flex items-center justify-center rounded-md text-gray-500 focus:outline-none md:hidden"
              onClick={() => setShowSearch(!showSearch)}
              type="button"
            >
              {showSearch ? (
                <XMarkIcon className="size-6" />
              ) : (
                <MagnifyingGlassIcon className="size-6" />
              )}
            </button>
            <Link
              className="hidden rounded-full outline-offset-8 md:block"
              href="/"
            >
              <img
                alt="Logo"
                className="size-8"
                height={32}
                src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
                width={32}
              />
            </Link>
            <div className="hidden sm:ml-6 md:block">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Search />
                </div>
                <NavItems />
              </div>
            </div>
          </div>
          <Link
            className={cn("md:hidden", !currentAccount?.address && "ml-[60px]")}
            href="/"
          >
            <img
              alt="Logo"
              className="size-7"
              height={32}
              src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
              width={32}
            />
          </Link>
          <div className="flex items-center gap-4">
            {currentAccount ? <NotificationIcon /> : null}
            <MenuItems />
          </div>
        </div>
      </div>
      {showSearch ? (
        <div className="m-3 md:hidden">
          <Search />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
