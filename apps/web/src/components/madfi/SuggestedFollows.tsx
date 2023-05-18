import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { DotsCircleHorizontalIcon, UsersIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import sampleFromArray from '@lib/sampleFromArray';
import sanitizeSingleProfileInterest from '@lib/sanitizeSingleProfileInterest';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile } from 'lens';
import { useProfilesQuery } from 'lens';
import { useFetchSuggestedFollowsForProfile } from 'madfi';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { FollowSource, MISCELLANEOUS } from 'src/tracking';
import { Card, EmptyState, ErrorMessage, Modal } from 'ui';

import SuggestedFull from './SuggestedFull';

const Title = ({ sanitizedInterest }: { sanitizedInterest?: string }) => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <div>
        <Trans>Suggested Follows</Trans>
      </div>
      {sanitizedInterest && (
        <span
          className={clsx(
            'text-brand ml-2 rounded-full px-2 py-1 text-xs !text-white sm:px-4',
            'border-brand-300 dark:border-brand-500 border',
            'bg-brand-500 dark:bg-brand-300/20'
          )}
          aria-label={sanitizedInterest}
        >
          {sanitizedInterest}
        </span>
      )}
    </div>
  );
};

const SuggestedFollows: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);
  const {
    data,
    loading: loadingSuggested,
    error
  } = useFetchSuggestedFollowsForProfile(currentProfile?.id);

  const { data: recommendedProfiles, loading: loadingProfiles } =
    useProfilesQuery({
      variables: { request: { profileIds: data?.suggestedFollows } },
      skip: !data?.suggestedFollows?.length
    });

  const recommendedProfilesNotFollowed = useMemo(() => {
    if (recommendedProfiles?.profiles?.items?.length) {
      return recommendedProfiles.profiles.items.filter(
        ({ isFollowedByMe, id }) => !isFollowedByMe && id !== currentProfile?.id
      );
    }

    return [];
  }, [recommendedProfiles]);

  const sampleRecommendedProfiles = useMemo(() => {
    return recommendedProfilesNotFollowed?.length
      ? sampleFromArray(recommendedProfilesNotFollowed, 5)
      : [];
  }, [recommendedProfilesNotFollowed]);

  const sanitizedInterest = useMemo(() => {
    if (!loadingSuggested && data?.interest) {
      return sanitizeSingleProfileInterest(data.interest);
    }
  }, [loadingSuggested, data]);

  if (loadingSuggested || loadingProfiles) {
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

  if (
    !(loadingSuggested && loadingProfiles) &&
    !recommendedProfilesNotFollowed.length
  ) {
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
      <Title sanitizedInterest={sanitizedInterest} />
      <Card as="aside">
        <div className="space-y-4 p-5">
          <ErrorMessage
            title={t`Failed to load recommendations`}
            error={error as Error}
          />
          {sampleRecommendedProfiles.map((profile, index) => (
            <div
              key={profile?.id}
              className="flex items-center space-x-3 truncate"
            >
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  isFollowing={profile.isFollowedByMe}
                  followPosition={index + 1}
                  followSource={FollowSource.WHO_TO_FOLLOW}
                  showFollow
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="flex w-full items-center space-x-2 rounded-b-xl border-t bg-gray-50 px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-100 dark:border-t-gray-700 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
          type="button"
          onClick={() => {
            setShowSuggestedModal(true);
            Mixpanel.track(MISCELLANEOUS.OPEN_RECOMMENDED_PROFILES);
          }}
        >
          <DotsCircleHorizontalIcon className="h-4 w-4" />
          <span>
            <Trans>Show more</Trans>
          </span>
        </button>
      </Card>
      <Modal
        title={t`Suggested for you`.concat(` - ${sanitizedInterest}`)}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
      >
        <SuggestedFull recommendedProfiles={(recommendedProfilesNotFollowed as unknown) as Profile[]} />
      </Modal>
    </>
  );
};

export default SuggestedFollows;
