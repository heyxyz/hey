import { gql, useQuery } from '@apollo/client';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardBody } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Profile } from '@generated/types';
import { MinimalProfileFields } from '@gql/MinimalProfileFields';
import { UsersIcon } from '@heroicons/react/outline';
import { LightningBoltIcon, SparklesIcon } from '@heroicons/react/solid';
import randomizeArray from '@lib/randomizeArray';
import React, { FC } from 'react';
import { useAppPersistStore } from 'src/store/app';

const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...MinimalProfileFields
      isFollowedByMe
    }
  }
  ${MinimalProfileFields}
`;

const Title = () => {
  const currentUser = useAppPersistStore((state) => state.currentUser);

  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Who to follow</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>Recommended users</div>
        </>
      )}
    </div>
  );
};

const RecommendedProfiles: FC = () => {
  const { data, loading, error } = useQuery(RECOMMENDED_PROFILES_QUERY);

  if (loading) {
    return (
      <>
        <Title />
        <Card>
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
      </>
    );
  }

  if (data?.recommendedProfiles?.length === 0) {
    return (
      <>
        <Title />
        <EmptyState
          message={
            <div>
              <span>No recommendations!</span>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand" />}
        />
      </>
    );
  }

  return (
    <>
      <Title />
      <Card>
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to load recommendations" error={error} />
          {randomizeArray(data?.recommendedProfiles)
            ?.slice(0, 5)
            ?.map((profile: Profile) => (
              <div key={profile?.id} className="truncate">
                <UserProfile profile={profile} isFollowing={profile.isFollowedByMe} showFollow />
              </div>
            ))}
        </CardBody>
      </Card>
    </>
  );
};

export default RecommendedProfiles;
