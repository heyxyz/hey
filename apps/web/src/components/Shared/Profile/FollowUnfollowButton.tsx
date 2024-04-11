import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FollowModuleType } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Follow from './Follow';
import SuperFollow from './SuperFollow';
import Unfollow from './Unfollow';

interface FollowUnfollowButtonProps {
  buttonClassName?: string;
  followTitle?: string;
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  profile: Profile;
  small?: boolean;
  superFollowTitle?: string;
  unfollowTitle?: string;
}

const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  buttonClassName = '',
  followTitle = 'Follow',
  hideFollowButton = false,
  hideUnfollowButton = false,
  profile,
  small = false,
  superFollowTitle = 'Super Follow',
  unfollowTitle = 'Following'
}) => {
  const { currentProfile } = useProfileStore();

  if (currentProfile?.id === profile.id) {
    return null;
  }

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideFollowButton &&
        (profile.operations.isFollowedByMe.value ? null : profile?.followModule
            ?.type === FollowModuleType.FeeFollowModule ? (
          <SuperFollow
            buttonClassName={buttonClassName}
            profile={profile}
            small={small}
            title={superFollowTitle}
          />
        ) : (
          <Follow
            buttonClassName={buttonClassName}
            profile={profile}
            small={small}
            title={followTitle}
          />
        ))}
      {!hideUnfollowButton &&
        (profile.operations.isFollowedByMe.value ? (
          <Unfollow
            buttonClassName={buttonClassName}
            profile={profile}
            small={small}
            title={unfollowTitle}
          />
        ) : null)}
    </div>
  );
};

export default FollowUnfollowButton;
