import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { DotsCircleHorizontalIcon, UsersIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage, Modal } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import sampleFromArray from '@lib/sampleFromArray';
import sanitizeSingleProfileInterest from '@lib/sanitizeSingleProfileInterest';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { useFetchSuggestedFollowsForProfile } from 'madfi';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { FollowSource, MISCELLANEOUS } from 'src/tracking';

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
      const res = recommendedProfiles.profiles.items.filter(
        ({ isFollowedByMe, id }: { isFollowedByMe: boolean; id: string }) =>
          !isFollowedByMe && id !== currentProfile?.id
      );

      if (data?.promotedProfile) {
        return res.sort((a: any, b: any) => {
          if (a.id === data.promotedProfile) {
            return -1;
          } else if (b.id === data.promotedProfile) {
            return 1;
          } else {
            return 0;
          }
        });
      }

      return res;
    }

    return [];
  }, [recommendedProfiles, currentProfile, data]);

  const sampleRecommendedProfiles = useMemo(() => {
    const sample = recommendedProfilesNotFollowed?.length
      ? sampleFromArray(recommendedProfilesNotFollowed, 5)
      : [];

    // include the promoted profile at the top
    if (sample.length && data?.promotedProfile) {
      const promoted = recommendedProfiles?.profiles?.items.find(
        ({ id }: { id: string }) => id === data.promotedProfile
      );

      if (promoted) {
        sample[0] = promoted;
      }
    }

    return sample;
  }, [recommendedProfilesNotFollowed, data, recommendedProfiles]);

  const sanitizedInterest = useMemo(() => {
    if (!loadingSuggested && data?.interest) {
      return sanitizeSingleProfileInterest(data.interest);
    } else if (!loadingSuggested) {
      return 'Trending'; // default when user is not tagged
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
    !loadingSuggested &&
    !loadingProfiles &&
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
          {sampleRecommendedProfiles.map((profile: any, index: number) => (
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
                  isPromoted={profile.id === data?.promotedProfile}
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
        title={t`Suggested for you`.concat(` - ${sanitizedInterest}`)}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
      >
        <SuggestedFull
          recommendedProfiles={
            recommendedProfilesNotFollowed as unknown as Profile[]
          }
        />
      </Modal>
    </>
  );
};

export default SuggestedFollows;
