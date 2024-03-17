import type { Profile, ProfilesRequest } from '@hey/lens';
import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useProfilesQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';

interface MirrorsProps {
  publicationId: string;
}

const Mirrors: FC<MirrorsProps> = ({ publicationId }) => {
  // Variables
  const request: ProfilesRequest = {
    limit: LimitType.TwentyFive,
    where: { whoMirroredPublication: publicationId }
  };

  const { data, error, fetchMore, loading } = useProfilesQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<ArrowsRightLeftIcon className="size-8" />}
          message="No mirrors."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mirrors"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/posts/${publicationId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Mirrored by</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        data={profiles}
        endReached={onEndReached}
        itemContent={(_, profile) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={profile as Profile}
                showBio
                showFollowUnfollowButton
                showUserPreview={false}
                source={ProfileLinkSource.Mirrors}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Mirrors;
