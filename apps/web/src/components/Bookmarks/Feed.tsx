import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  PublicationBookmarksRequest,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import { LimitType, usePublicationBookmarksQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { type FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from '@store/non-persisted/useImpressionsStore';

interface FeedProps {
  focus?: PublicationMetadataMainFocusType;
}

const Feed: FC<FeedProps> = ({ focus }) => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: PublicationBookmarksRequest = {
    where: { metadata: { ...(focus && { mainContentFocus: [focus] }) } },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = usePublicationBookmarksQuery({
    variables: { request },
    onCompleted: async ({ publicationBookmarks }) => {
      const ids =
        publicationBookmarks?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const publications = data?.publicationBookmarks?.items;
  const pageInfo = data?.publicationBookmarks?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids =
        data?.publicationBookmarks?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message="No bookmarks yet!"
        icon={<BookmarkIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load bookmark feed" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
