import type { Profile } from '@hey/lens';
import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { ProfileLinkSource } from '@hey/data/tracking';
import { useStaffPicksQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface BatchRange {
  end: number;
  start: number;
}

const Title: FC = () => <p className="text-lg font-semibold">Staff Picks</p>;

const StaffPicks: FC = () => {
  const { currentProfile } = useProfileStore();

  const fetchStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${HEY_API_URL}/staff-picks`);

    return response.data.result;
  };

  const {
    data: picks,
    error: picksError,
    isLoading: picksLoading
  } = useQuery({ queryFn: fetchStaffPicks, queryKey: ['fetchStaffPicks'] });

  const dividePicks = (
    picks: StaffPick[],
    totalBatches: number
  ): BatchRange[] => {
    const perBatch = Math.ceil(picks.length / totalBatches);
    return Array.from({ length: totalBatches }, (_, index) => ({
      end: Math.min((index + 1) * perBatch, picks.length),
      start: index * perBatch
    }));
  };

  const batchRanges = dividePicks(picks || [], 3); // We want to divide into three batches

  const batchVariables = batchRanges.map((range) =>
    picks?.slice(range.start, range.end).map((pick) => pick.profileId)
  );

  const {
    data: staffPicks,
    error: profilesError,
    loading: profilesLoading
  } = useStaffPicksQuery({
    skip: picks?.length === 0,
    variables: {
      batch1: batchVariables[0] || [],
      batch2: batchVariables[1] || [],
      batch3: batchVariables[2] || []
    }
  });

  if (picksLoading || profilesLoading) {
    return (
      <Card as="aside" className="mb-4 space-y-4 p-5">
        <Title />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
      </Card>
    );
  }

  if (picks?.length === 0) {
    return (
      <Card as="aside" className="mb-4 p-5">
        <Title />
        <EmptyState
          hideCard
          icon={<CursorArrowRippleIconOutline className="size-8" />}
          message="Nothing here!"
        />
      </Card>
    );
  }

  const profiles = [
    ...(staffPicks?.batch1?.items || []),
    ...(staffPicks?.batch2?.items || []),
    ...(staffPicks?.batch3?.items || [])
  ];

  const filteredProfiles = profiles
    .filter(
      (profile) =>
        !profile.operations.isBlockedByMe.value &&
        !profile.operations.isFollowedByMe.value &&
        currentProfile?.id !== profile.id
    )
    .slice(0, 5);

  if (filteredProfiles.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <Title />
      <ErrorMessage
        error={picksError || profilesError}
        title="Failed to load recommendations"
      />
      {filteredProfiles.map((profile) => (
        <div className="flex items-center space-x-3 truncate" key={profile.id}>
          <div className="w-full">
            <UserProfile
              hideFollowButton={currentProfile?.id === profile.id}
              hideUnfollowButton
              profile={profile as Profile}
              source={ProfileLinkSource.StaffPicks}
            />
          </div>
        </div>
      ))}
    </Card>
  );
};

export default StaffPicks;
