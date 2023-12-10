import type { AnyPublication, Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { useProfilesQuery } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card, ErrorMessage } from '@hey/ui';

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
      <ErrorMessage error={error} title="Failed to load relevant people" />
      {data?.profiles?.items?.map((profile) => (
        <div className="truncate" key={profile?.id}>
          <UserProfile
            profile={profile as Profile}
            showFollow
            showUserPreview={false}
          />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;
