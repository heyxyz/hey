import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import Virtualized from '@components/Virtualization';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FeedHighlightsRequest, Publication } from 'lens';
import { useFeedHighlightsQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import type { AutoSizerProps, ListProps, WindowScrollerProps } from 'react-virtualized';
import { AutoSizer as _AutoSizer, List as _List, WindowScroller as _WindowScroller } from 'react-virtualized';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';
import { Card, EmptyState, ErrorMessage } from 'ui';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: FeedHighlightsRequest = { profileId: currentProfile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;

  const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
  const List = _List as unknown as FC<ListProps>;
  const WindowScroller = _WindowScroller as unknown as FC<WindowScrollerProps>;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      }).then(({ data }) => {
        setHasMore(data?.feedHighlights?.items?.length > 0);
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return <EmptyState message={t`No posts yet!`} icon={<CollectionIcon className="text-brand h-8 w-8" />} />;
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load highlights`} error={error} />;
  }

  return (
    <Virtualized>
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {txnQueue?.map(
          (txn) =>
            txn?.type === OptmisticPublicationType.NewPost && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} />
              </div>
            )
        )}
        {publications?.map((publication, index) => (
          <div key="index">
            <SinglePublication key={`${publication?.id}_${index}`} publication={publication as Publication} />
          </div>
        ))}
        {hasMore && <span ref={observe} />}
      </Card>
    </Virtualized>
  );
};

export default Highlights;
