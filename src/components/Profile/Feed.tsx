import { useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { LensterPublication } from '@generated/lenstertypes';
import type { Profile } from '@generated/types';
import { ProfileFeedDocument, PublicationMainFocus, PublicationTypes } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';

interface Props {
  profile: Profile;
  type: 'FEED' | 'REPLIES' | 'MEDIA';
}

const Feed: FC<Props> = ({ profile, type }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const publicationTypes =
    type === 'FEED'
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === 'MEDIA'
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata =
    type === 'MEDIA'
      ? {
          mainContentFocus: [
            PublicationMainFocus.Video,
            PublicationMainFocus.Image,
            PublicationMainFocus.Audio
          ]
        }
      : null;
  const request = { publicationTypes, metadata, profileId: profile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(ProfileFeedDocument, {
    variables: { request, reactionRequest, profileId },
    skip: !profile?.id
  });

  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>hasn’t {type.toLowerCase()}ed yet!</span>
          </div>
        }
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load profile feed" error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<InfiniteLoader />}
    >
      <Card className="divide-y-[1px] dark:divide-gray-700/80">
        {publications?.map((publication, index: number) => (
          <SinglePublication
            key={`${publication.id}_${index}`}
            publication={publication as LensterPublication}
            showThread={type !== 'MEDIA'}
          />
        ))}
      </Card>
    </InfiniteScroll>
  );
};

export default Feed;
