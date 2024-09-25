import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FeatureFlag } from "@hey/data/feature-flags";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useProStore } from "src/store/non-persisted/useProStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import MenuTransition from "../MenuTransition";
import Slug from "../Slug";
import { NextLink } from "./MenuItems";
import MobileDrawerMenu from "./MobileDrawerMenu";
import AppVersion from "./NavItems/AppVersion";
import Logout from "./NavItems/Logout";
import OptimisticTransactions from "./NavItems/OptimisticTransactions";
import Pro from "./NavItems/Pro";
import ProfileStatus from "./NavItems/ProfileStatus";
import Settings from "./NavItems/Settings";
import SwitchProfile from "./NavItems/SwitchProfile";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourProfile from "./NavItems/YourProfile";

const SignedProfile: FC = () => {
  const { currentProfile } = useProfileStore();
  const { isPro } = useProStore();
  const { setShowMobileDrawer, showMobileDrawer } = useGlobalModalStateStore();
  const proEnabled = useFlag(FeatureFlag.Pro);

  const Avatar = () => (
    <Image
      alt={currentProfile?.id}
      className="size-8 cursor-pointer rounded-full border dark:border-gray-700"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(currentProfile?.id);
      }}
      src={getAvatar(currentProfile as Profile)}
    />
  );

  const openMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer ? <MobileDrawerMenu /> : null}
      <button
        className="focus:outline-none md:hidden"
        onClick={() => openMobileMenuDrawer()}
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
              href={getProfile(currentProfile).link}
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug
                    className="font-bold"
                    slug={getProfile(currentProfile).slugWithPrefix}
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
              <SwitchProfile />
            </MenuItem>
            <div className="divider" />
            {isPro && (
              <>
                <MenuItem
                  as="div"
                  className={({ focus }: { focus: boolean }) =>
                    cn(
                      { "dropdown-active": focus },
                      "m-2 rounded-lg border dark:border-gray-700"
                    )
                  }
                >
                  <ProfileStatus id={currentProfile?.id} />
                </MenuItem>
                <div className="divider" />
              </>
            )}
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ "dropdown-active": focus }, "menu-item")
              }
              href={getProfile(currentProfile).link}
            >
              <YourProfile />
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
            {proEnabled && (
              <MenuItem
                as={NextLink}
                className={({ focus }: { focus: boolean }) =>
                  cn({ "dropdown-active": focus }, "menu-item")
                }
                href="/pro"
              >
                <Pro />
              </MenuItem>
            )}
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

export default SignedProfile;
