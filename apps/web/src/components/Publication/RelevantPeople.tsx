import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { AnyPublication, Profile } from '@hey/lens';
import { useProfilesQuery } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card, ErrorMessage } from '@hey/ui';
import type { FC } from 'react';

interface RelevantPeopleProps {
  publication: AnyPublication;
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { profilesMentioned } = targetPublication;

  const profileIds = profilesMentioned.map(
    (profile) => profile.snapshotHandleMentioned.linkedTo?.nftTokenId
  );

  const { data, loading, error } = useProfilesQuery({
    variables: { request: { where: { profileIds } } },
    skip: profileIds.length <= 0
  });

  if (profileIds.length <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="space-y-4 p-5">
      <ErrorMessage title="Failed to load relevant people" error={error} />
      {data?.profiles?.items?.map((profile, index) => (
        <div key={profile?.id} className="truncate">
          <UserProfile
            profile={profile as Profile}
            isFollowing={profile.operations.isFollowedByMe.value}
            followUnfollowPosition={index + 1}
            followUnfollowSource={
              FollowUnfollowSource.PUBLICATION_RELEVANT_PROFILES
            }
            showUserPreview={false}
            showFollow
          />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;
