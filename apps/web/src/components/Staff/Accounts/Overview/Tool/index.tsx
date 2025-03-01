import SingleAccount from "@components/Shared/SingleAccount";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import getInternalAccount, {
  GET_INTERNAL_ACCOUNT_QUERY_KEY
} from "@hey/helpers/api/getInternalAccount";
import type { AccountFragment } from "@hey/indexer";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import AccountOverview from "./AccountOverview";
import AccountPreferences from "./AccountPreferences";
import ManagedAccounts from "./ManagedAccounts";
import Permissions from "./Permissions";

interface AccountStaffToolProps {
  account: AccountFragment;
}

const AccountStaffTool: FC<AccountStaffToolProps> = ({ account }) => {
  const { data: preferences } = useQuery({
    queryFn: () => getInternalAccount(account.address, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, account.address || ""]
  });

  return (
    <div>
      <SingleAccount
        hideFollowButton
        hideUnfollowButton
        isBig
        linkToAccount
        account={account}
        showBio
        showUserPreview={false}
      />
      <AccountOverview account={account} />
      {preferences ? <AccountPreferences preferences={preferences} /> : null}
      {preferences ? (
        <>
          <Permissions
            permissions={preferences.permissions || []}
            accountAddress={account.address}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      <ManagedAccounts address={account.owner} />
    </div>
  );
};

export default AccountStaffTool;
