import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/24/outline';
import type { HomeFeedType } from '@hey/data/enums';
import type { Publication, PublicationsQueryRequest } from '@hey/lens';
import { useProfileFeedQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import getAlgorithmicFeed from '@lib/getAlgorithmicFeed';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [displayedPublications, setDisplayedPublications] = useState<any[]>([]);

  const limit = 20;
  const offset = displayedPublications.length;

  const {
    data: publicationIds,
    isLoading: algoLoading,
    error: algoError
  } = useQuery(
    ['algorithmicFeed', feedType, currentProfile?.id, limit, offset],
    () => {
      return getAlgorithmicFeed(feedType, currentProfile, limit, offset);
    }
  );

  useEffect(() => {
    setDisplayedPublications([]);
  }, [feedType, currentProfile?.id]);

  const request: PublicationsQueryRequest = { publicationIds, limit };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationIds,
    fetchPolicy: 'no-cache'
  });

  const publications = [
    ...displayedPublications,
    ...(data?.publications?.items || [])
  ];

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }
      if (publications.length != displayedPublications.length) {
        setDisplayedPublications(publications);
      }
    }
  });

  if (publications.length == 0 && (algoLoading || loading)) {
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

  if (publications.length == 0 && (error || algoError)) {
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
