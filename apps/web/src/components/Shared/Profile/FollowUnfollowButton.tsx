import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FollowModuleType } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';

import Follow from './Follow';
import SuperFollow from './SuperFollow';
import Unfollow from './Unfollow';

interface FollowUnfollowButtonProps {
  followTitle?: string;
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  profile: Profile;
  small?: boolean;
  superFollowTitle?: string;
  unfollowTitle?: string;
}

const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  followTitle = 'Follow',
  hideFollowButton = false,
  hideUnfollowButton = false,
  profile,
  small = false,
  superFollowTitle = 'Super Follow',
  unfollowTitle = 'Following'
}) => {
  return (
    <div className="mr-1" onClick={stopEventPropagation}>
      {!hideFollowButton &&
        (profile.operations.isFollowedByMe.value ? null : profile?.followModule
            ?.type === FollowModuleType.FeeFollowModule ? (
          <SuperFollow
            profile={profile}
            small={small}
            title={superFollowTitle}
          />
        ) : (
          <Follow profile={profile} small={small} title={followTitle} />
        ))}
      {!hideUnfollowButton &&
        (profile.operations.isFollowedByMe.value ? (
          <Unfollow profile={profile} small={small} title={unfollowTitle} />
        ) : null)}
    </div>
  );
};

export default FollowUnfollowButton;
