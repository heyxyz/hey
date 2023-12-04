import Follow from '@components/Shared/Profile/Follow';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import { FollowUnfollowSource } from '@hey/data/tracking';
import { FollowModuleType, type Profile } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Button, Image } from '@hey/ui';
import { type Dispatch, type FC, type SetStateAction } from 'react';

interface FollowModalProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  setShowFollowModal: Dispatch<SetStateAction<boolean>>;
}

const FollowModal: FC<FollowModalProps> = ({
  profile,
  setFollowing,
  setShowFollowModal
}) => {
  const followType = profile?.followModule?.type;

  return (
    <div className="p-5">
      <div className="flex justify-between text-lg font-bold">
        <span className="flex">
          <Image
            alt={profile?.id}
            className="mr-2 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            src={getAvatar(profile)}
          />
          <Slug
            className="flex items-center"
            slug={getProfile(profile).slugWithPrefix}
          />
        </span>
        <span className="flex">
          {followType === FollowModuleType.FeeFollowModule ? (
            <div className="flex space-x-2">
              <SuperFollow
                profile={profile}
                setFollowing={setFollowing}
                showText
              />
            </div>
          ) : (
            <div className="flex space-x-2">
              <Follow
                followSource={FollowUnfollowSource.FOLLOW_DIALOG}
                profile={profile}
                setFollowing={setFollowing}
                showText
              />
            </div>
          )}
          <Button
            aria-label="Not now"
            className="ml-3 !px-3 !py-1.5 text-sm"
            onClick={() => {
              setShowFollowModal(false);
            }}
            outline
          >
            Not now
          </Button>
        </span>
      </div>
    </div>
  );
};

export default FollowModal;
