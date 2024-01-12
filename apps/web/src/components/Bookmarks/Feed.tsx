import type {
  AnyPublication,
  PublicationBookmarksRequest,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { LimitType, usePublicationBookmarksQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

interface FeedProps {
  focus?: PublicationMetadataMainFocusType;
}

const Feed: FC<FeedProps> = ({ focus }) => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: PublicationBookmarksRequest = {
    limit: LimitType.TwentyFive,
    where: { metadata: { ...(focus && { mainContentFocus: [focus] }) } }
  };

  const { data, error, fetchMore, loading } = usePublicationBookmarksQuery({
    onCompleted: async ({ publicationBookmarks }) => {
      const ids =
        publicationBookmarks?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
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
        icon={<BookmarkIcon className="text-brand-500 size-8" />}
        message="No bookmarks yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load bookmark feed" />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          key={`${publication.id}_${index}`}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
