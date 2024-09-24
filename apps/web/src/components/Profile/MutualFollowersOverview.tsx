import MutualFollowers from "@components/Shared/Modal/MutualFollowers";
import getAvatar from "@hey/helpers/getAvatar";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { LimitType, useMutualFollowersQuery } from "@hey/lens";
import { Modal, StackedAvatars } from "@hey/ui";
import cn from "@hey/ui/cn";
import { type FC, type ReactNode, useState } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface MutualFollowersOverviewProps {
  handle: string;
  profileId: string;
  viaPopover?: boolean;
}

const MutualFollowersOverview: FC<MutualFollowersOverviewProps> = ({
  handle,
  profileId,
  viaPopover = false
}) => {
  const { currentProfile } = useProfileStore();
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);

  const { data, error, loading } = useMutualFollowersQuery({
    skip: !profileId || !currentProfile?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: currentProfile?.id,
        viewing: profileId
      }
    }
  });

  const profiles =
    (data?.mutualFollowers?.items.slice(0, 4) as Profile[]) || [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <button
      className={cn(
        viaPopover ? "text-xs" : "text-sm",
        "ld-text-gray-500 flex cursor-pointer flex-wrap items-center gap-2.5"
      )}
      onClick={() => setShowMutualFollowersModal(true)}
      type="button"
    >
      <StackedAvatars
        avatars={profiles.map((profile) => getAvatar(profile))}
        limit={3}
      />
      <div>
        <span>Followed by </span>
        {children}
      </div>
      <Modal
        onClose={() => setShowMutualFollowersModal(false)}
        show={showMutualFollowersModal}
        title="Mutual Followers"
      >
        <MutualFollowers handle={handle} profileId={profileId} />
      </Modal>
    </button>
  );

  if (profiles.length === 0 || loading || error) {
    return null;
  }

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName} and </span>
        <span>{getProfile(profileTwo).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}, </span>
        <span>
          {getProfile(profileTwo).displayName}
          {isZero ? " and " : ", "}
        </span>
        <span>{getProfile(profileThree).displayName} </span>
        {!isZero ? (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? "other" : "others"}
          </span>
        ) : null}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{getProfile(profileOne).displayName}, </span>
      <span>{getProfile(profileTwo).displayName}, </span>
      <span>{getProfile(profileThree).displayName} </span>
      <span>and others</span>
    </Wrapper>
  );
};

export default MutualFollowersOverview;
