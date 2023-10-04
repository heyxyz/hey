import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { ExplorePublicationRequest, Publication } from '@hey/lens';
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExploreFeedQuery
} from '@hey/lens';
import type { Group } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface FeedProps {
  group: Group;
}

const Feed: FC<FeedProps> = ({ group }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const request: ExplorePublicationRequest = {
    publicationTypes: [PublicationTypes.Post],
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: { tags: { oneOf: group.tags } },
    limit: 30
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !group.id
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
        message={
          <div>
            <span className="mr-1 font-bold">{group.name}</span>
            <span>{t`don't have any publications yet`}</span>
          </div>
        }
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load group feed`} error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
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
