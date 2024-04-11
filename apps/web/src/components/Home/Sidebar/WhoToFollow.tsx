import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { PROFILE, ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useProfileRecommendationsQuery } from '@hey/lens';
import { Card, ErrorMessage, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Suggested from '../Suggested';

const Title: FC = () => <p className="text-lg font-semibold">Who to Follow</p>;

const WhoToFollow: FC = () => {
  const { currentProfile } = useProfileStore();
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);

  const { data, error, loading } = useProfileRecommendationsQuery({
    variables: {
      request: {
        for: currentProfile?.id,
        limit: LimitType.Fifty,
        shuffle: true
      }
    }
  });

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <Title />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <div className="pb-1 pt-2">
          <div className="shimmer h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (data?.profileRecommendations.items.length === 0) {
    return null;
  }

  const recommendedProfiles = data?.profileRecommendations.items.filter(
    (profile) =>
      !profile.operations.isBlockedByMe.value &&
      !profile.operations.isFollowedByMe.value
  );

  if (recommendedProfiles?.length === 0) {
    return null;
  }

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <Title />
        <ErrorMessage error={error} title="Failed to load recommendations" />
        {recommendedProfiles?.slice(0, 5).map((profile) => (
          <div
            className="flex items-center space-x-3 truncate"
            key={profile?.id}
          >
            <div className="w-full">
              <UserProfile
                hideFollowButton={currentProfile?.id === profile.id}
                hideUnfollowButton={currentProfile?.id === profile.id}
                profile={profile as Profile}
                source={ProfileLinkSource.WhoToFollow}
              />
            </div>
            <DismissRecommendedProfile profile={profile as Profile} />
          </div>
        ))}
        <button
          className="ld-text-gray-500 font-bold"
          onClick={() => {
            setShowSuggestedModal(true);
            Leafwatch.track(PROFILE.OPEN_RECOMMENDED_PROFILES);
          }}
          type="button"
        >
          Show more
        </button>
      </Card>
      <Modal
        icon={<UsersIcon className="size-5" />}
        onClose={() => setShowSuggestedModal(false)}
        show={showSuggestedModal}
        title="Suggested for you"
      >
        <Suggested profiles={recommendedProfiles as Profile[]} />
      </Modal>
    </>
  );
};

export default WhoToFollow;
