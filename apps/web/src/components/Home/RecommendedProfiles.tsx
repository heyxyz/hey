import { FollowSource } from '@components/Shared/Follow';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Modal } from '@components/UI/Modal';
import { DotsCircleHorizontalIcon, UsersIcon } from '@heroicons/react/outline';
import { SparklesIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import type { Profile } from 'lens';
import { useRecommendedProfilesQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

import Suggested from './Suggested';

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
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);
  const { data, loading, error } = useRecommendedProfilesQuery({
    variables: { options: { shuffle: false } }
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
        <EmptyState message={t`No recommendations!`} icon={<UsersIcon className="text-brand h-8 w-8" />} />
      </>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside">
        <div className="space-y-4 p-5">
          <ErrorMessage title={t`Failed to load recommendations`} error={error} />
          {data?.recommendedProfiles?.slice(0, 5)?.map((profile, index) => (
            <div key={profile?.id} className="truncate">
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.WHO_TO_FOLLOW}
                showFollow
              />
            </div>
          ))}
        </div>
        <button
          className="flex w-full items-center space-x-2 rounded-b-xl border-t bg-gray-50 px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-100 dark:border-t-gray-700 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
          type="button"
          onClick={() => {
            setShowSuggestedModal(true);
            Analytics.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
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
