import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { useRecommendedProfilesQuery } from '@lenster/lens';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FollowUnfollowSource } from 'src/tracking';

const Suggested: FC = () => {
  const { data, loading, error } = useRecommendedProfilesQuery();

  if (loading) {
    return <Loader message={t`Loading suggested`} />;
  }

  if (data?.recommendedProfiles?.length === 0) {
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
      <ErrorMessage title={t`Failed to load recommendations`} error={error} />
      <Virtuoso
        className="virtual-profile-list"
        data={data?.recommendedProfiles}
        itemContent={(index, profile) => {
          return (
            <div className="flex items-center space-x-3 p-5">
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  isFollowing={profile?.isFollowedByMe}
                  followUnfollowPosition={index + 1}
                  followUnfollowSource={
                    FollowUnfollowSource.WHO_TO_FOLLOW_MODAL
                  }
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              </div>
              <DismissRecommendedProfile
                profile={profile as Profile}
                dismissPosition={index + 1}
                dismissSource={FollowUnfollowSource.WHO_TO_FOLLOW_MODAL}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Suggested;
