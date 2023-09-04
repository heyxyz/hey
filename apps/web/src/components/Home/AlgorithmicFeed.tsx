import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/outline';
import type { HomeFeedType } from '@lenster/data/enums';
import type { Publication, PublicationsQueryRequest } from '@lenster/lens';
import { useProfileFeedQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import getAlgorithmicFeed from '@lib/getAlgorithmicFeed';
import { t } from '@lingui/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const limit = 20;

  const {
    data: publicationIds,
    isLoading: algoLoading,
    error: algoError,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['algorithmicFeed', feedType, currentProfile?.id],
    queryFn: ({ pageParam = 0 }) =>
      getAlgorithmicFeed(feedType, currentProfile, 20, pageParam * 20),

    getNextPageParam: (lastPage, pages) =>
      lastPage.length < 20 ? null : pages.length
  });

  const request: PublicationsQueryRequest = {
    publicationIds: publicationIds?.pages[publicationIds.pages.length - 1],
    limit: 20
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore, refetch } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationIds
  });

  useEffect(() => {
    refetch();
  }, [feedType, currentProfile?.id, refetch]);

  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }
      if (hasNextPage) {
        await fetchNextPage();

        await fetchMore({
          variables: {
            request: { ...request, cursor: pageInfo?.next },
            reactionRequest,
            profileId
          }
        });
      }
    }
  });

  if (algoLoading || loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={t`No posts yet!`}
        icon={<SparklesIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error || algoError) {
    return <ErrorMessage title={t`Failed to load for you`} error={error} />;
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
      <span ref={observe} />
    </Card>
  );
};

export default AlgorithmicFeed;
