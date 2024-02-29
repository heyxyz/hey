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
import { motion } from 'framer-motion';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Suggested from '../Suggested';

const Title: FC = () => <p className="text-lg font-semibold">Who to Follow</p>;

const WhoToFollow: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
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
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
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

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <Title />
        <ErrorMessage error={error} title="Failed to load recommendations" />
        {recommendedProfiles?.slice(0, 5).map((profile) => (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3 truncate"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={profile?.id}
          >
            <div className="w-full">
              <UserProfile
                profile={profile as Profile}
                showFollow
                source={ProfileLinkSource.WhoToFollow}
              />
            </div>
            <DismissRecommendedProfile profile={profile as Profile} />
          </motion.div>
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
        icon={<UsersIcon className="text-brand-500 size-5" />}
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
