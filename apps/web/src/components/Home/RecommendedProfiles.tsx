import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { DotsCircleHorizontalIcon, UsersIcon } from '@heroicons/react/outline';
import { SparklesIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import { useRecommendedProfilesQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage, Modal } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { FollowUnfollowSource, MISCELLANEOUS } from 'src/tracking';

import Suggested from './Suggested';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { useAppStore } from 'src/store/app';
import { FeatureFlag } from '@lenster/data';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <SparklesIcon className="h-4 w-4 text-yellow-500" />
      <div>
        <Trans>Who to follow</Trans>
      </div>
    </div>
  );
};

const RecommendedProfiles: FC = () => {
  const isWTF2Enabled = isFeatureEnabled(FeatureFlag.WTF2);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);

  const { data, loading, error } = useRecommendedProfilesQuery({
    variables: {
      options: { profileId: isWTF2Enabled ? currentProfile?.id : null }
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

  if (data?.recommendedProfiles?.length === 0) {
    return (
      <>
        <Title />
        <EmptyState
          message={t`No recommendations!`}
          icon={<UsersIcon className="text-brand h-8 w-8" />}
        />
      </>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside">
        <div className="space-y-4 p-5">
          <ErrorMessage
            title={t`Failed to load recommendations`}
            error={error}
          />
          {data?.recommendedProfiles?.slice(0, 5)?.map((profile, index) => (
            <div
              key={profile?.id}
              className="flex items-center space-x-3 truncate"
            >
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  isFollowing={profile.isFollowedByMe}
                  followUnfollowPosition={index + 1}
                  followUnfollowSource={FollowUnfollowSource.WHO_TO_FOLLOW}
                  showFollow
                />
              </div>
              <DismissRecommendedProfile
                profile={profile as Profile}
                dismissPosition={index + 1}
                dismissSource={FollowUnfollowSource.WHO_TO_FOLLOW}
              />
            </div>
          ))}
        </div>
        <button
          className="flex w-full items-center space-x-2 rounded-b-xl border-t bg-gray-50 px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-100 dark:border-t-gray-700 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
          type="button"
          onClick={() => {
            setShowSuggestedModal(true);
            Leafwatch.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
          }}
        >
          <DotsCircleHorizontalIcon className="h-4 w-4" />
          <span>
            <Trans>Show more</Trans>
          </span>
        </button>
      </Card>
      <Modal
        title={t`Suggested for you`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
      >
        <Suggested />
      </Modal>
    </>
  );
};

export default RecommendedProfiles;
