import QueuedPost from "@components/Post/QueuedPost";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import type { AnyPost } from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const ForYou: FC = () => {
  const { currentAccount } = useAccountStore();
  const { txnQueue } = useTransactionStore();

  const request: PublicationForYouRequest = {
    for: currentAccount?.address,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useForYouQuery({
    variables: { request }
  });

  const posts = data?.forYou?.items;
  const pageInfo = data?.forYou?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <PostsShimmer />;
  }

  if (posts?.length === 0) {
    return (
      <EmptyState
        icon={<LightBulbIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load highlights" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPostType.Post ? (
          <QueuedPost key={txn.txHash} txn={txn} />
        ) : null
      )}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, item) => `${item.publication.id}-${index}`}
          data={posts}
          endReached={onEndReached}
          itemContent={(index, item) => (
            <SinglePost
              isFirst={index === 0}
              isLast={index === (posts?.length || 0) - 1}
              post={item.publication as AnyPost}
            />
          )}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default ForYou;
