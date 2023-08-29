import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  ExplorePublicationRequest,
  Publication,
  PublicationMainFocus
} from '@lenster/lens';
import {
  CustomFiltersTypes,
  PublicationSortCriteria,
  useExploreFeedQuery
} from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { For } from 'million/react';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { useExploreStore } from 'src/store/explore';

interface FeedProps {
  focus?: PublicationMainFocus;
  feedType?: PublicationSortCriteria;
}

const Feed: FC<FeedProps> = ({
  focus,
  feedType = PublicationSortCriteria.CuratedProfiles
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedTag = useExploreStore((state) => state.selectedTag);

  // Variables
  const request: ExplorePublicationRequest = {
    sortCriteria: feedType,
    noRandomize: feedType === 'LATEST',
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      ...(focus && { mainContentFocus: [focus] }),
      ...(selectedTag && { tags: { oneOf: [selectedTag] } })
    },
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
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
        message={t`No posts yet!`}
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load explore feed`} error={error} />
    );
  }

  return (
    <Card
      className="divide-y-[1px] dark:divide-gray-700"
      dataTestId="explore-feed"
    >
      {publications && (
        <For each={publications} memo>
          {(publication, index) => (
            <SinglePublication
              isFirst={index === 0}
              key={`${publication.id}_${index}`}
              publication={publication as Publication}
              isLast={index === publications.length - 1}
            />
          )}
        </For>
      )}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
