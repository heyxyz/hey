import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import { FollowModuleType } from "@hey/lens";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Follow from "./Follow";
import SuperFollow from "./SuperFollow";
import Unfollow from "./Unfollow";

interface FollowUnfollowButtonProps {
  buttonClassName?: string;
  followTitle?: string;
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  account: Profile;
  small?: boolean;
  superFollowTitle?: string;
  unfollowTitle?: string;
}

const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  buttonClassName = "",
  followTitle = "Follow",
  hideFollowButton = false,
  hideUnfollowButton = false,
  account,
  small = false,
  superFollowTitle = "Super Follow",
  unfollowTitle = "Following"
}) => {
  const { currentAccount } = useAccountStore();

  if (currentAccount?.id === account.id) {
    return null;
  }

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideFollowButton &&
        (account.operations.isFollowedByMe.value ? null : account?.followModule
            ?.type === FollowModuleType.FeeFollowModule ? (
          <SuperFollow
            buttonClassName={buttonClassName}
            account={account}
            small={small}
            title={superFollowTitle}
          />
        ) : (
          <Follow
            buttonClassName={buttonClassName}
            account={account}
            small={small}
            title={followTitle}
          />
        ))}
      {!hideUnfollowButton &&
        (account.operations.isFollowedByMe.value ? (
          <Unfollow
            buttonClassName={buttonClassName}
            account={account}
            small={small}
            title={unfollowTitle}
          />
        ) : null)}
    </div>
  );
};

export default FollowUnfollowButton;
