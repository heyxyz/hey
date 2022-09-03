import { gql, useQuery } from '@apollo/client';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardBody } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Modal } from '@components/UI/Modal';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { DotsCircleHorizontalIcon, UsersIcon } from '@heroicons/react/outline';
import { SparklesIcon } from '@heroicons/react/solid';
import { Hog } from '@lib/hog';
import React, { FC, useState } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

import Suggested from './Suggested';

export const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...ProfileFields
      isFollowedByMe
    }
  }
  ${ProfileFields}
`;

const Title = () => {
  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      <SparklesIcon className="w-4 h-4 text-yellow-500" />
      <div>Who to follow</div>
    </div>
  );
};

const RecommendedProfiles: FC = () => {
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);
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
      <Card as="aside">
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to load recommendations" error={error} />
          {data?.recommendedProfiles?.slice(0, 5)?.map((profile: Profile) => (
            <div key={profile?.id} className="truncate">
              <UserProfile profile={profile} isFollowing={profile.isFollowedByMe} showFollow />
            </div>
          ))}
        </CardBody>
        <button
          className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-t dark:border-t-gray-700/80 text-sm w-full rounded-b-xl text-left px-5 py-3 flex items-center space-x-2 text-gray-600 dark:text-gray-300"
          onClick={() => {
            setShowSuggestedModal(true);
            Hog.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
          }}
        >
          <DotsCircleHorizontalIcon className="h-4 w-4" />
          <span>Show more</span>
        </button>
      </Card>
      <Modal
        title="Suggested for you"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
      >
        <Suggested />
      </Modal>
    </>
  );
};

export default RecommendedProfiles;
