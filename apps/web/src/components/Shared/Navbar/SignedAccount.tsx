import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import MenuTransition from "../MenuTransition";
import Slug from "../Slug";
import { NextLink } from "./MenuItems";
import MobileDrawerMenu from "./MobileDrawerMenu";
import AccountStatus from "./NavItems/AccountStatus";
import AppVersion from "./NavItems/AppVersion";
import Logout from "./NavItems/Logout";
import OptimisticTransactions from "./NavItems/OptimisticTransactions";
import Settings from "./NavItems/Settings";
import SwitchAccount from "./NavItems/SwitchAccount";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourAccount from "./NavItems/YourAccount";

const SignedAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const { setShowMobileDrawer, showMobileDrawer } = useGlobalModalStateStore();

  const Avatar = () => (
    <Image
      alt={currentAccount?.id}
      className="size-8 cursor-pointer rounded-full border dark:border-gray-700"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(currentAccount?.id);
      }}
      src={getAvatar(currentAccount as Profile)}
    />
  );

  const handleOpenMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer ? <MobileDrawerMenu /> : null}
      <button
        className="focus:outline-none md:hidden"
        onClick={handleOpenMobileMenuDrawer}
        type="button"
      >
        <Avatar />
      </button>
      <Menu as="div" className="hidden md:block">
        <MenuButton className="flex self-center rounded-full">
          <Avatar />
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
            static
          >
            <MenuItem
              as={NextLink}
              className="m-2 flex items-center rounded-lg px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              href={getAccount(currentAccount).link}
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug
                    className="font-bold"
                    slug={getAccount(currentAccount).slugWithPrefix}
                  />
                </div>
              </div>
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }: { focus: boolean }) =>
                cn(
                  { "dropdown-active": focus },
                  "m-2 rounded-lg border dark:border-gray-700"
                )
              }
            >
              <SwitchAccount />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }: { focus: boolean }) =>
                cn(
                  { "dropdown-active": focus },
                  "m-2 rounded-lg border dark:border-gray-700"
                )
              }
            >
              <AccountStatus id={currentAccount?.id} />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ "dropdown-active": focus }, "menu-item")
              }
              href={getAccount(currentAccount).link}
            >
              <YourAccount />
            </MenuItem>
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ "dropdown-active": focus }, "menu-item")
              }
              href="/settings"
            >
              <Settings />
            </MenuItem>
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ "dropdown-active": focus }, "m-2 rounded-lg")
              }
            >
              <Logout />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ "dropdown-active": focus }, "m-2 rounded-lg")
              }
            >
              <ThemeSwitch />
            </MenuItem>
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ "dropdown-active": focus }, "m-2 rounded-lg")
              }
            >
              <OptimisticTransactions />
            </MenuItem>
            <div className="divider" />
            <AppVersion />
          </MenuItems>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedAccount;
