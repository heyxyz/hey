import SingleAccount from "@components/Shared/SingleAccount";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { IS_MAINNET } from "@hey/data/constants";
import getInternalProfile, {
  GET_INTERNAL_PROFILE_QUERY_KEY
} from "@hey/helpers/api/getInternalProfile";
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
  profile: Profile;
}

const AccountStaffTool: FC<AccountStaffToolProps> = ({ profile }) => {
  const { data: preferences } = useQuery({
    queryFn: () => getInternalProfile(profile.id, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_PROFILE_QUERY_KEY, profile.id || ""]
  });

  return (
    <div>
      <SingleAccount
        hideFollowButton
        hideUnfollowButton
        isBig
        linkToProfile
        profile={profile}
        showBio
        showUserPreview={false}
      />
      <AccountOverview profile={profile} />
      {preferences ? <AccountPreferences preferences={preferences} /> : null}
      {IS_MAINNET ? (
        <>
          <LeafwatchDetails profileId={profile.id} />
          <div className="divider my-5 border-yellow-600 border-dashed" />
          <Rank
            handle={profile.handle?.localName}
            lensClassifierScore={profile.stats.lensClassifierScore || 0}
            profileId={profile.id}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      {preferences ? (
        <>
          <Permissions
            permissions={preferences.permissions || []}
            profileId={profile.id}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      <ManagedAccounts address={profile.ownedBy.address} />
    </div>
  );
};

export default AccountStaffTool;
