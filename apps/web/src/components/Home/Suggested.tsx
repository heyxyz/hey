import { FollowSource } from '@components/Shared/Follow';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { UsersIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Profile } from 'lens';
import { useRecommendedProfilesQuery } from 'lens';
import type { FC } from 'react';

const Suggested: FC = () => {
  const { data, loading, error } = useRecommendedProfilesQuery();

  if (loading) {
    return <Loader message={t`Loading suggested`} />;
  }

  if (data?.recommendedProfiles?.length === 0) {
    return (
      <EmptyState
        message={t`Nothing to suggest`}
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage title={t`Failed to load recommendations`} error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {data?.recommendedProfiles?.map((profile, index) => (
            <div className="p-5" key={profile?.id}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggested;
