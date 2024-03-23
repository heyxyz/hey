import type { Profile } from '@hey/lens';
import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { ProfileLinkSource } from '@hey/data/tracking';
import { useProfilesQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

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

  const {
    data: profiles,
    error: profilesError,
    loading: profilesLoading
  } = useProfilesQuery({
    skip: picks?.length === 0,
    variables: {
      request: { where: { profileIds: picks?.map((pick) => pick.profileId) } }
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

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <Title />
      <ErrorMessage
        error={picksError || profilesError}
        title="Failed to load recommendations"
      />
      {profiles?.profiles.items.map((profile) => (
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
