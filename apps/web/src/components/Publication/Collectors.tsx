import type { Profile, WhoActedOnPublicationRequest } from '@hey/lens';
import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useWhoActedOnPublicationQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  // Variables
  const request: WhoActedOnPublicationRequest = {
    limit: LimitType.TwentyFive,
    on: publicationId
  };

  const { data, error, fetchMore, loading } = useWhoActedOnPublicationQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.whoActedOnPublication?.items;
  const pageInfo = data?.whoActedOnPublication?.pageInfo;
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
          icon={<RectangleStackIcon className="size-8" />}
          message="No collectors."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load collectors"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/posts/${publicationId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Collected by</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(_, profile) => profile.id}
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
                source={ProfileLinkSource.Collects}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Collectors;
