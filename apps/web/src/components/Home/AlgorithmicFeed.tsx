import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/24/outline';
import type { HomeFeedType } from '@hey/data/enums';
import type { AnyPublication, PublicationsRequest } from '@hey/lens';
import { LimitType, usePublicationsQuery } from '@hey/lens';
import getAlgorithmicFeed from '@hey/lib/getAlgorithmicFeed';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/useAppStore';
import { useImpressionsStore } from 'src/store/useImpressionsStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const [displayedPublications, setDisplayedPublications] = useState<any[]>([]);

  const virtuosoRef = useRef<any>();

  const limit = LimitType.TwentyFive;
  const offset = displayedPublications.length;

  const {
    data: publicationIds,
    isLoading: algoLoading,
    error: algoError
  } = useQuery({
    queryKey: ['getAlgorithmicFeed', feedType, currentProfile?.id, 25, offset],
    queryFn: async () =>
      await getAlgorithmicFeed(feedType, currentProfile, 25, offset)
  });

  useEffect(() => {
    setDisplayedPublications([]);
  }, [feedType, currentProfile?.id]);

  const request: PublicationsRequest = {
    where: { publicationIds },
    limit
  };

  const { data, loading, error } = usePublicationsQuery({
    variables: { request },
    skip: !publicationIds,
    fetchPolicy: 'no-cache',
    onCompleted: async ({ publications }) => {
      const ids =
        publications?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const publications = [
    ...displayedPublications,
    ...(data?.publications?.items || [])
  ];

  const onEndReached = async () => {
    if (publications.length != displayedPublications.length) {
      setDisplayedPublications(publications);
    }
  };

  const onScrolling = (scrolling: boolean) => {
    virtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        virtuosoState = { ...state };
      }
    });
  };

  if (publications.length == 0 && (algoLoading || loading)) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message="No posts yet!"
        icon={<SparklesIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (publications.length == 0 && (error || algoError)) {
    return <ErrorMessage title="Failed to load for you" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.length ? (
        <Virtuoso
          useWindowScroll
          restoreStateFrom={
            virtuosoState.ranges.length === 0
              ? virtuosoRef?.current?.getState((state: StateSnapshot) => state)
              : virtuosoState
          }
          ref={virtuosoRef}
          data={publications}
          isScrolling={onScrolling}
          endReached={onEndReached}
          className="virtual-feed-list"
          itemContent={(index, publication) => {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SinglePublication
                  key={`${publication.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  publication={publication as AnyPublication}
                />
              </motion.div>
            );
          }}
        />
      ) : null}
    </Card>
  );
};

export default AlgorithmicFeed;
