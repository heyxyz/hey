import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FollowModuleType } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';

import Follow from './Follow';
import SuperFollow from './SuperFollow';
import Unfollow from './Unfollow';

interface FollowUnfollowButtonProps {
  profile: Profile;
  small?: boolean;
}

const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  profile,
  small = false
}) => {
  return (
    <div onClick={stopEventPropagation}>
      {profile.operations.isFollowedByMe.value ? null : profile?.followModule
          ?.type === FollowModuleType.FeeFollowModule ? (
        <SuperFollow profile={profile} small={small} />
      ) : (
        <Follow profile={profile} small={small} />
      )}
      {profile.operations.isFollowedByMe.value ? (
        <Unfollow profile={profile} small={small} />
      ) : null}
    </div>
  );
};

export default FollowUnfollowButton;
