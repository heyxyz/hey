import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import {
  LimitType,
  type Profile,
  useWhoReactedPublicationQuery,
  type WhoReactedPublicationRequest
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';

interface LikesProps {
  publicationId: string;
}

const Likes: FC<LikesProps> = ({ publicationId }) => {
  // Variables
  const request: WhoReactedPublicationRequest = {
    for: publicationId,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useWhoReactedPublicationQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;
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
          icon={<HeartIcon className="size-8" />}
          message="No likes."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load likes"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/posts/${publicationId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Liked by</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(_, like) => like.profile.id}
        data={profiles}
        endReached={onEndReached}
        itemContent={(_, like) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={like.profile as Profile}
                showBio
                showFollowUnfollowButton
                showUserPreview={false}
                source={ProfileLinkSource.Likes}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Likes;
