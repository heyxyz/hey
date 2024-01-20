import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { useProfileRecommendationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Suggested from '../Suggested';

const RecommendedProfiles: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);

  const { data, error, loading } = useProfileRecommendationsQuery({
    variables: {
      request: { for: seeThroughProfile?.id || currentProfile?.id }
    }
  });

  if (loading) {
    return (
      <Card className="space-y-3.5 p-5">
        <div className="text-lg font-semibold">Who to follow</div>
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <div className="shimmer h-3 w-5/12 rounded-full" />
      </Card>
    );
  }

  if (data?.profileRecommendations.items.length === 0) {
    return (
      <Card className="p-5">
        <div className="text-lg font-semibold">Who to follow</div>
        <EmptyState
          hideCard
          icon={<UsersIcon className="text-brand-500 size-8" />}
          message="No recommendations!"
        />
      </Card>
    );
  }

  const recommendedProfiles = data?.profileRecommendations.items.filter(
    (profile) => !profile.operations.isBlockedByMe.value
  );

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <div className="text-lg font-semibold">Who to follow</div>
        <ErrorMessage error={error} title="Failed to load recommendations" />
        {recommendedProfiles?.slice(0, 5)?.map((profile) => (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3 truncate"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={profile?.id}
          >
            <div className="w-full">
              <UserProfile profile={profile as Profile} showFollow />
            </div>
            <DismissRecommendedProfile profile={profile as Profile} />
          </motion.div>
        ))}
        <button
          className="ld-text-gray-500 font-bold"
          onClick={() => {
            setShowSuggestedModal(true);
            Leafwatch.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
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
        <Suggested />
      </Modal>
    </>
  );
};

export default RecommendedProfiles;
