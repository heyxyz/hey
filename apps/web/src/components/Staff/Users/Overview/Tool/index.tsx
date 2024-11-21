import SingleAccount from "@components/Shared/SingleAccount";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { IS_MAINNET } from "@hey/data/constants";
import getInternalAccount, {
  GET_INTERNAL_ACCOUNT_QUERY_KEY
} from "@hey/helpers/api/getInternalAccount";
import type { Profile } from "@hey/lens";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import AccountOverview from "./AccountOverview";
import AccountPreferences from "./AccountPreferences";
import LeafwatchDetails from "./LeafwatchDetails";
import ManagedAccounts from "./ManagedAccounts";
import Permissions from "./Permissions";
import Rank from "./Rank";

interface AccountStaffToolProps {
  account: Profile;
}

const AccountStaffTool: FC<AccountStaffToolProps> = ({ account }) => {
  const { data: preferences } = useQuery({
    queryFn: () => getInternalAccount(account.id, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, account.id || ""]
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
      {IS_MAINNET ? (
        <>
          <LeafwatchDetails accountId={account.id} />
          <div className="divider my-5 border-yellow-600 border-dashed" />
          <Rank
            handle={account.handle?.localName}
            lensClassifierScore={account.stats.lensClassifierScore || 0}
            accountId={account.id}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      {preferences ? (
        <>
          <Permissions
            permissions={preferences.permissions || []}
            accountId={account.id}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      <ManagedAccounts address={account.ownedBy.address} />
    </div>
  );
};

export default AccountStaffTool;
