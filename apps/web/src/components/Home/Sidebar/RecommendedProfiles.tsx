import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import {
  EllipsisHorizontalCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { useProfileRecommendationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Suggested from '../Suggested';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <SparklesIcon className="size-4 text-yellow-500" />
      <div>Who to follow</div>
    </div>
  );
};

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
      <>
        <Title />
        <Card className="space-y-4 p-5">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </Card>
      </>
    );
  }

  if (data?.profileRecommendations.items.length === 0) {
    return (
      <>
        <Title />
        <EmptyState
          icon={<UsersIcon className="text-brand-500 size-8" />}
          message="No recommendations!"
        />
      </>
    );
  }

  const recommendedProfiles = data?.profileRecommendations.items.filter(
    (profile) => !profile.operations.isBlockedByMe.value
  );

  return (
    <>
      <Title />
      <Card as="aside">
        <div className="space-y-4 p-5">
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
        </div>
        <button
          className="flex w-full items-center space-x-2 rounded-b-xl border-t bg-gray-50 px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-100 dark:border-t-gray-700 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
          onClick={() => {
            setShowSuggestedModal(true);
            Leafwatch.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
          }}
          type="button"
        >
          <EllipsisHorizontalCircleIcon className="size-4" />
          <span>Show more</span>
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
