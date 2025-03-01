import { XMarkIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import Link from "next/link";
import type { FC } from "react";
import { useMobileDrawerModalStore } from "src/store/non-persisted/modal/useMobileDrawerModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Slug from "../Slug";
import AppVersion from "./NavItems/AppVersion";
import Bookmarks from "./NavItems/Bookmarks";
import Groups from "./NavItems/Groups";
import Logout from "./NavItems/Logout";
import Settings from "./NavItems/Settings";
import StaffTools from "./NavItems/StaffTools";
import Support from "./NavItems/Support";
import SwitchAccount from "./NavItems/SwitchAccount";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourAccount from "./NavItems/YourAccount";

const MobileDrawerMenu: FC = () => {
  const { currentAccount } = useAccountStore();
  const { setShowMobileDrawer } = useMobileDrawerModalStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const handleCloseDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = "py-3 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-100 py-4 md:hidden dark:bg-black">
      <button className="px-5" onClick={handleCloseDrawer} type="button">
        <XMarkIcon className="size-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
          href={getAccount(currentAccount).link}
          onClick={handleCloseDrawer}
        >
          <div className="flex w-full space-x-1.5">
            <Image
              alt={currentAccount?.address}
              className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
              src={getAvatar(currentAccount)}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getAccount(currentAccount).usernameWithPrefix}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <SwitchAccount className={cn(itemClass, "px-4")} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Link
              href={getAccount(currentAccount).link}
              onClick={handleCloseDrawer}
            >
              <YourAccount className={cn(itemClass, "px-4")} />
            </Link>
            <Link href="/settings" onClick={handleCloseDrawer}>
              <Settings className={cn(itemClass, "px-4")} />
            </Link>
            {isStaff ? (
              <Link href="/staff" onClick={handleCloseDrawer}>
                <StaffTools className={cn(itemClass, "px-4")} />
              </Link>
            ) : null}
            <Groups
              className={cn(itemClass, "px-4")}
              onClick={handleCloseDrawer}
            />
            <Bookmarks
              className={cn(itemClass, "px-4")}
              onClick={handleCloseDrawer}
            />
            <ThemeSwitch
              className={cn(itemClass, "px-4")}
              onClick={handleCloseDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Support className={cn(itemClass, "px-4")} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              className={cn(itemClass, "px-4 py-3")}
              onClick={handleCloseDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        {currentAccount ? <AppVersion /> : null}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
