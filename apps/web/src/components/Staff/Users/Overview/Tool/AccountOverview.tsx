import MetaDetails from "@components/Shared/MetaDetails";
import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import formatAddress from "@hey/helpers/formatAddress";
import type { Account } from "@hey/indexer";
import { H5 } from "@hey/ui";
import type { FC } from "react";

interface AccountOverviewProps {
  account: Account;
}

const AccountOverview: FC<AccountOverviewProps> = ({ account }) => {
  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <H5>Account Overview</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 size-4" />}
          title="Account ID"
          value={account.address}
        >
          {account.address}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="ld-text-gray-500 size-4" />}
          title="Address"
          value={account.owner}
        >
          {formatAddress(account.owner)}
        </MetaDetails>
        {account?.followNftAddress ? (
          <MetaDetails
            icon={<PhotoIcon className="ld-text-gray-500 size-4" />}
            title="NFT address"
            value={account.followNftAddress.address}
          >
            {formatAddress(account.followNftAddress.address)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Has Lens Manager"
        >
          {account.signless ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Gas sponsored"
        >
          {account.sponsor ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
      </div>
    </>
  );
};

export default AccountOverview;
