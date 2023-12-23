import type { HomeFeedType } from '@hey/data/enums';
import type { AnyPublication, PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { LimitType, usePublicationsQuery } from '@hey/lens';
import getAlgorithmicFeed from '@hey/lib/getAlgorithmicFeed';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [displayedPublications, setDisplayedPublications] = useState<any[]>([]);

  const limit = LimitType.TwentyFive;
  const offset = displayedPublications.length;

  const {
    data: publicationIds,
    error: algoError,
    isLoading: algoLoading
  } = useQuery({
    queryFn: async () =>
      await getAlgorithmicFeed(feedType, currentProfile, 25, offset),
    queryKey: ['getAlgorithmicFeed', feedType, currentProfile?.id, 25, offset]
  });

  useEffect(() => {
    setDisplayedPublications([]);
  }, [feedType, currentProfile?.id]);

  const request: PublicationsRequest = {
    limit,
    where: { publicationIds }
  };

  const { data, error, loading } = usePublicationsQuery({
    fetchPolicy: 'no-cache',
    skip: !publicationIds,
    variables: { request }
  });

  const publications = [
    ...displayedPublications,
    ...(data?.publications?.items || [])
  ];

  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }
      if (publications.length !== displayedPublications.length) {
        setDisplayedPublications(publications);
      }
    }
  });

  if (publications.length === 0 && (algoLoading || loading)) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<SparklesIcon className="text-brand-500 size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (publications.length === 0 && (error || algoError)) {
    return <ErrorMessage error={error} title="Failed to load for you" />;
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
      <span ref={observe} />
    </Card>
  );
};

export default AlgorithmicFeed;
