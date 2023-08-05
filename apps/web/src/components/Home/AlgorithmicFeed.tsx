import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/outline';
import { HomeFeedType } from '@lenster/data/enums';
import type { Publication, PublicationsQueryRequest } from '@lenster/lens';
import { useProfileFeedQuery } from '@lenster/lens';
import type { K3lFeedType } from '@lenster/types/algorithms';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import k3lFeed from '@lib/feed-algorithms/k3lFeed';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const {
    data: publicationIds,
    isLoading: algoLoading,
    error: algoError
  } = useQuery(['algorithmicFeed', feedType], () => {
    switch (feedType) {
      case HomeFeedType.K3L_RECOMMENDED:
        const type = feedType.replace('K3L_', '').toLowerCase() as K3lFeedType;
        return k3lFeed(type).then((data) => data);
      default:
        return [];
    }
  });

  const request: PublicationsQueryRequest = { publicationIds, limit: 20 };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationIds
  });

  const publications = data?.publications?.items;

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
    </Card>
  );
};

export default AlgorithmicFeed;
