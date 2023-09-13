import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/outline';
import type { HomeFeedType } from '@lenster/data/enums';
import type { Publication, PublicationsQueryRequest } from '@lenster/lens';
import { useProfileFeedQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import getAlgorithmicFeed from '@lib/getAlgorithmicFeed';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface AlgorithmicFeedProps {
  feedType: HomeFeedType;
}

let algoFeedVirtuosoState: any = { ranges: [], screenTop: 0 };

const AlgorithmicFeed: FC<AlgorithmicFeedProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const alogFeedVirtuosoRef = useRef<any>();
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

  const onScrolling = (scrolling: boolean) => {
    alogFeedVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        algoFeedVirtuosoState = { ...state };
      }
    });
  };

  const onEndReached = async () => {
    if (publications.length != displayedPublications.length) {
      setDisplayedPublications(publications);
    }
  };

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications && (
        <Virtuoso
          endReached={onEndReached}
          restoreStateFrom={
            algoFeedVirtuosoState.ranges.length === 0
              ? alogFeedVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : algoFeedVirtuosoState
          }
          ref={alogFeedVirtuosoRef}
          useWindowScroll
          data={publications}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          itemContent={(index, publication) => {
            return (
              <div className="border-b-[1px] dark:border-gray-700">
                <SinglePublication
                  key={`${publication.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  publication={publication as Publication}
                />
              </div>
            );
          }}
        />
      )}
    </Card>
  );
};

export default AlgorithmicFeed;
