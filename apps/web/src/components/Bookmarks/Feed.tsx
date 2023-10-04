import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import type {
  Publication,
  PublicationMainFocus,
  PublicationsProfileBookmarkedQueryRequest
} from '@hey/lens';
import { usePublicationsProfileBookmarksQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface FeedProps {
  focus?: PublicationMainFocus;
}

const Feed: FC<FeedProps> = ({ focus }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: PublicationsProfileBookmarkedQueryRequest = {
    profileId: currentProfile?.id,
    metadata: {
      ...(focus && { mainContentFocus: [focus] })
    },
    limit: 30
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } =
    usePublicationsProfileBookmarksQuery({
      variables: { request, reactionRequest, profileId }
    });

  const publications = data?.publicationsProfileBookmarks?.items;
  const pageInfo = data?.publicationsProfileBookmarks?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: {
          request: { ...request, cursor: pageInfo?.next },
          reactionRequest,
          profileId
        }
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={t`No bookmarks yet!`}
        icon={<BookmarkIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load bookmark feed`} error={error} />
    );
  }

  return (
    <Card
      className="divide-y-[1px] dark:divide-gray-700"
      dataTestId="explore-feed"
    >
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as Publication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
