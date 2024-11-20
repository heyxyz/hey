import MutualFollowers from "@components/Shared/Modal/MutualFollowers";
import { Leafwatch } from "@helpers/leafwatch";
import { PROFILE } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { Profile } from "@hey/lens";
import { LimitType, useMutualFollowersQuery } from "@hey/lens";
import { Modal, StackedAvatars } from "@hey/ui";
import cn from "@hey/ui/cn";
import { type FC, type ReactNode, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

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
  const { currentAccount } = useAccountStore();
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);

  const { data, error, loading } = useMutualFollowersQuery({
    skip: !profileId || !currentAccount?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: currentAccount?.id,
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
        "ld-text-gray-500 flex cursor-pointer items-center space-x-2"
      )}
      onClick={() => setShowMutualFollowersModal(true)}
      type="button"
    >
      <StackedAvatars
        avatars={profiles.map((profile) => getAvatar(profile))}
        limit={3}
      />
      <div className="text-left">
        <span>Followed by </span>
        {children}
      </div>
      <Modal
        onClose={() => {
          Leafwatch.track(PROFILE.OPEN_MUTUAL_FOLLOWERS);
          setShowMutualFollowersModal(false);
        }}
        show={showMutualFollowersModal}
        title="Mutual Followers"
        size="md"
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
        <span>{getAccount(profileOne).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{getAccount(profileOne).displayName} and </span>
        <span>{getAccount(profileTwo).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getAccount(profileOne).displayName}, </span>
        <span>
          {getAccount(profileTwo).displayName}
          {isZero ? " and " : ", "}
        </span>
        <span>{getAccount(profileThree).displayName} </span>
        {isZero ? null : (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? "other" : "others"}
          </span>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{getAccount(profileOne).displayName}, </span>
      <span>{getAccount(profileTwo).displayName}, </span>
      <span>{getAccount(profileThree).displayName} </span>
      <span>and others</span>
    </Wrapper>
  );
};

export default MutualFollowersOverview;
