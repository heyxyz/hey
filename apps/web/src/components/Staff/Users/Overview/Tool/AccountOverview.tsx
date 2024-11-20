import MetaDetails from "@components/Shared/MetaDetails";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
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
import { APP_NAME, HEY_API_URL } from "@hey/data/constants";
import formatAddress from "@hey/helpers/formatAddress";
import type { Profile } from "@hey/lens";
import { H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const GET_HAVE_USED_HEY_QUERY_KEY = "getHaveUsedHey";

interface AccountOverviewProps {
  account: Profile;
}

const AccountOverview: FC<AccountOverviewProps> = ({ account }) => {
  const getHaveUsedHey = async () => {
    try {
      const { data } = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/haveUsedHey`,
        { headers: getAuthApiHeaders(), params: { id: account.id } }
      );

      return data.haveUsedHey;
    } catch {
      return false;
    }
  };

  const { data: haveUsedHey } = useQuery({
    queryFn: getHaveUsedHey,
    queryKey: [GET_HAVE_USED_HEY_QUERY_KEY, account.id]
  });

  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <H5>Profile Overview</H5>
      </div>
      <div className="mt-3 space-y-2">
        {haveUsedHey ? (
          <MetaDetails
            icon={
              <img
                alt="Logo"
                className="size-4"
                height={16}
                src="/logo.png"
                width={16}
              />
            }
          >
            Have used {APP_NAME}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 size-4" />}
          title="Profile ID"
          value={account.id}
        >
          {account.id}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="ld-text-gray-500 size-4" />}
          title="Address"
          value={account.ownedBy.address}
        >
          {formatAddress(account.ownedBy.address)}
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
