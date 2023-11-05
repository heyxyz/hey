import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedItem, FeedRequest } from '@hey/lens';
import { FeedEventItemType, useFeedQuery } from '@hey/lens';
import getPublicationViewCountById from '@hey/lib/getPublicationViewCountById';
import { OptmisticPublicationType } from '@hey/types/enums';
import type { PublicationViewCount } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import getPublicationsViews from '@lib/getPublicationsViews';
import { type FC, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/useAppStore';
import { useTimelinePersistStore } from 'src/store/useTimelinePersistStore';
import { useTimelineStore } from 'src/store/useTimelineStore';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

const Timeline: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore(
    (state) => state.feedEventFilters
  );
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );

  const [views, setViews] = useState<PublicationViewCount[] | []>([]);

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(FeedEventItemType.Post, FeedEventItemType.Comment);
    }
    if (feedEventFilters.collects) {
      filters.push(FeedEventItemType.Collect, FeedEventItemType.Comment);
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.likes) {
      filters.push(FeedEventItemType.Reaction, FeedEventItemType.Comment);
    }
    return filters;
  };

  const fetchAndStoreViews = async (ids: string[]) => {
    if (ids.length) {
      const viewsResponse = await getPublicationsViews(ids);
      setViews((prev) => [...prev, ...viewsResponse]);
    }
  };

  // Variables
  const request: FeedRequest = {
    where: {
      for: seeThroughProfile?.id ?? currentProfile?.id,
      feedEventItemTypes: getFeedEventItems()
    }
  };

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: { request },
    onCompleted: async ({ feed }) => {
      const ids =
        feed?.items?.flatMap((p) => {
          return [
            p.root.id,
            p.comments?.[0]?.id,
            p.root.__typename === 'Comment' && p.root.commentOn?.id
          ].filter((id) => id);
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;
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
        data.feed?.items?.flatMap((p) => {
          return [
            p.root.id,
            p.comments?.[0]?.id,
            p.root.__typename === 'Comment' && p.root.commentOn?.id
          ].filter((id) => id);
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
        message="No posts yet!"
        icon={<UserGroupIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load timeline" error={error} />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type !== OptmisticPublicationType.NewComment ? (
          <QueuedPublication key={txn.id} txn={txn} />
        ) : null
      )}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {publications?.map((publication, index) => (
          <SinglePublication
            key={`${publication.root.__typename}_${index}`}
            isFirst={index === 0}
            isLast={index === publications.length - 1}
            feedItem={publication as FeedItem}
            publication={publication.root as AnyPublication}
            views={getPublicationViewCountById(
              views,
              publication.root as AnyPublication
            )}
          />
        ))}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default Timeline;
