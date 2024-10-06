import SingleProfile from "@components/Shared/SingleProfile";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { IS_MAINNET } from "@hey/data/constants";
import getInternalProfile from "@hey/helpers/api/getInternalProfile";
import type { Profile } from "@hey/lens";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import LeafwatchDetails from "./LeafwatchDetails";
import ManagedProfiles from "./ManagedProfiles";
import Permissions from "./Permissions";
import ProOverview from "./ProOverview";
import ProfileOverview from "./ProfileOverview";
import ProfilePreferences from "./ProfilePreferences";
import Rank from "./Rank";

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  const { data: preferences } = useQuery({
    queryFn: () => getInternalProfile(profile.id, getAuthApiHeaders()),
    queryKey: ["getInternalProfile", profile.id || ""]
  });

  return (
    <div>
      <SingleProfile
        hideFollowButton
        hideUnfollowButton
        isBig
        linkToProfile
        profile={profile}
        showBio
        showUserPreview={false}
      />
      <ProfileOverview profile={profile} />
      {preferences ? (
        <>
          <ProOverview preferences={preferences} />
          <ProfilePreferences preferences={preferences} />
        </>
      ) : null}
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
      <ManagedProfiles address={profile.ownedBy.address} />
    </div>
  );
};

export default ProfileStaffTool;
