import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Profile } from '@lenster/lens';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FollowSource } from 'src/tracking';
import { EmptyState } from '@lenster/ui';

const SuggestedFull: FC<{ recommendedProfiles: Profile[] }> = ({
  recommendedProfiles
}: {
  recommendedProfiles: Profile[];
}) => {
  if (recommendedProfiles?.length === 0) {
    return (
      <EmptyState
        message={t`Nothing to suggest`}
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="virtual-profile-list"
        data={recommendedProfiles}
        itemContent={(index, profile) => {
          return (
            <div className="flex items-center space-x-3 p-5">
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  isFollowing={profile?.isFollowedByMe}
                  followPosition={index + 1}
                  followSource={FollowSource.WHO_TO_FOLLOW_MODAL}
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              </div>
              <DismissRecommendedProfile
                profile={profile as Profile}
                dismissPosition={index + 1}
                dismissSource={FollowSource.WHO_TO_FOLLOW_MODAL}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default SuggestedFull;
