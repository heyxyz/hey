import type { Profile, ProfileMentioned } from '@hey/lens';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { useProfilesQuery } from '@hey/lens';
import { Card, ErrorMessage, Modal } from '@hey/ui';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MoreRelevantPeople from './MoreRelevantPeople';

interface RelevantPeopleProps {
  profilesMentioned: ProfileMentioned[];
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ profilesMentioned }) => {
  const { currentProfile } = useProfileStore();
  const [showMore, setShowMore] = useState(false);

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
        <div className="pb-1 pt-2">
          <div className="shimmer h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  const firstProfiles = data?.profiles?.items?.slice(0, 5);

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <ErrorMessage error={error} title="Failed to load relevant people" />
        {firstProfiles?.map((profile) => (
          <div className="truncate" key={profile?.id}>
            <UserProfile
              hideFollowButton={currentProfile?.id === profile.id}
              hideUnfollowButton={currentProfile?.id === profile.id}
              profile={profile as Profile}
              showUserPreview={false}
              source={ProfileLinkSource.RelevantPeople}
            />
          </div>
        ))}
        {(data?.profiles?.items?.length || 0) > 5 && (
          <button
            className="ld-text-gray-500 font-bold"
            onClick={() => setShowMore(true)}
            type="button"
          >
            Show more
          </button>
        )}
      </Card>
      <Modal
        icon={<UsersIcon className="size-5" />}
        onClose={() => setShowMore(false)}
        show={showMore}
        title="Relevant people"
      >
        <MoreRelevantPeople profiles={data?.profiles?.items as Profile[]} />
      </Modal>
    </>
  );
};

export default RelevantPeople;
