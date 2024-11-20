import SingleAccount from "@components/Shared/SingleAccount";
import { ProfileLinkSource } from "@hey/data/tracking";
import type { Profile } from "@hey/lens";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MoreRelevantPeopleProps {
  profiles: Profile[];
}

const MoreRelevantPeople: FC<MoreRelevantPeopleProps> = ({ profiles }) => {
  const { currentAccount } = useAccountStore();

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="virtual-profile-list"
        computeItemKey={(index, profile) => `${profile.id}-${index}`}
        // remove the first 5 profiles from the list because they are already shown in the sidebar
        data={profiles.slice(5)}
        itemContent={(_, profile) => (
          <div className="p-5">
            <SingleAccount
              hideFollowButton={currentAccount?.id === profile.id}
              hideUnfollowButton={currentAccount?.id === profile.id}
              profile={profile as Profile}
              showBio
              showUserPreview={false}
              source={ProfileLinkSource.WhoToFollow}
            />
          </div>
        )}
      />
    </div>
  );
};

export default MoreRelevantPeople;
