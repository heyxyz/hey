import type { Profile, WhoActedOnPublicationRequest } from '@hey/lens';
import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import { LimitType, useWhoActedOnPublicationQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface TippersProps {
  publicationId: string;
}

const Tippers: FC<TippersProps> = ({ publicationId }) => {
  const { currentProfile } = useProfileStore();

  // Variables
  const request: WhoActedOnPublicationRequest = {
    limit: LimitType.TwentyFive,
    on: publicationId,
    where: {
      anyOf: [{ address: VerifiedOpenActionModules.Tip }]
    }
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
          icon={<TipIcon className="size-8" />}
          message="No tippers."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load tippers"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/posts/${publicationId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Tipped by</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, profile) => `${profile.id}-${index}`}
        data={profiles}
        endReached={onEndReached}
        itemContent={(_, profile) => {
          return (
            <div className="p-5">
              <UserProfile
                hideFollowButton={currentProfile?.id === profile.id}
                hideUnfollowButton={currentProfile?.id === profile.id}
                profile={profile as Profile}
                showBio
                showUserPreview={false}
                source={ProfileLinkSource.Tips}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Tippers;
