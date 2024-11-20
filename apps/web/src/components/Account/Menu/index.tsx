import MenuTransition from "@components/Shared/MenuTransition";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import type { FC } from "react";
import { Fragment } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import AddToList from "./AddToList";
import Block from "./Block";
import CopyAddress from "./CopyAddress";
import CopyID from "./CopyID";
import CopyLink from "./CopyLink";
import Report from "./Report";

interface AccountMenuProps {
  account: Profile;
}

const AccountMenu: FC<AccountMenuProps> = ({ account }) => {
  const { currentAccount } = useAccountStore();

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon className="ld-text-gray-500 size-5" />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <CopyLink account={account} />
          <CopyAddress address={account.ownedBy.address} />
          <CopyID id={account.id} />
          {currentAccount && currentAccount?.id !== account.id ? (
            <>
              <AddToList account={account} />
              <Block account={account} />
              <Report account={account} />
            </>
          ) : null}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default AccountMenu;
