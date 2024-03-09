import type { Profile, ProfileMentioned } from '@hey/lens';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ProfileLinkSource } from '@hey/data/tracking';
import { useProfilesQuery } from '@hey/lens';
import { Card, ErrorMessage } from '@hey/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface RelevantPeopleProps {
  profilesMentioned: ProfileMentioned[];
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ profilesMentioned }) => {
  const { currentProfile } = useProfileStore();
  const profileIds = profilesMentioned.map(
    (profile) => profile.snapshotHandleMentioned.linkedTo?.nftTokenId
  );

  const { data, error, loading } = useProfilesQuery({
    skip: profileIds.length <= 0,
    variables: { request: { where: { profileIds } } }
  });

  if (profileIds.length <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
        <UserProfileShimmer showFollowUnfollowButton />
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="space-y-4 p-5">
      <ErrorMessage error={error} title="Failed to load relevant people" />
      {data?.profiles?.items?.map((profile) => (
        <div className="truncate" key={profile?.id}>
          <UserProfile
            profile={profile as Profile}
            showFollowUnfollowButton={profile?.id !== currentProfile?.id}
            showUserPreview={false}
            source={ProfileLinkSource.RelevantPeople}
          />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;
