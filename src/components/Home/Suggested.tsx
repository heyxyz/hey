import { useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { Profile } from '@generated/types';
import { RecommendedProfilesDocument } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const Suggested: FC = () => {
  const { data, loading, error } = useQuery(RecommendedProfilesDocument);

  if (loading) {
    return <Loader message="Loading suggested" />;
  }

  if (data?.recommendedProfiles?.length === 0) {
    return (
      <EmptyState message="Nothing to suggest" icon={<UsersIcon className="w-8 h-8 text-brand" />} hideCard />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage title="Failed to load recommendations" error={error} />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {data?.recommendedProfiles?.map((profile) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile
                profile={profile as Profile}
                showBio
                showFollow
                isFollowing={profile?.isFollowedByMe}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggested;
