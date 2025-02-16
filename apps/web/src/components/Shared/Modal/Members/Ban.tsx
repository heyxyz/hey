import { NoSymbolIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import {
  type Account,
  type Group,
  useBanGroupAccountsMutation
} from "@hey/indexer";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";

interface BanProps {
  group: Group;
  account: Account;
}

const Ban: FC<BanProps> = ({ group, account }) => {
  const isBanned = group.operations?.isBanned;

  const [banGroupAccounts] = useBanGroupAccountsMutation();

  const handleBan = () => {
    return banGroupAccounts({
      variables: {
        request: { accounts: [account.address], group: group.address }
      }
    });
  };

  return (
    <Tooltip content={isBanned ? "Unban" : "Ban"} placement="top">
      <button onClick={handleBan} type="button">
        {isBanned ? (
          <UserPlusIcon className="size-4 text-green-500" />
        ) : (
          <NoSymbolIcon className="size-4 text-red-500" />
        )}
      </button>
    </Tooltip>
  );
};

export default Ban;
