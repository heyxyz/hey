import QueuedPost from "@components/Post/QueuedPost";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  type MlpostsForYouRequest,
  PageSize,
  type Post,
  useMlPostsForYouQuery
} from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const ForYou: FC = () => {
  const { currentAccount } = useAccountStore();
  const { txnQueue } = useTransactionStore();

  const request: MlpostsForYouRequest = {
    pageSize: PageSize.Fifty,
    account: currentAccount?.address,
    shuffle: true
  };

  const { data, error, fetchMore, loading } = useMlPostsForYouQuery({
    variables: { request }
  });

  const posts = data?.mlPostsForYou.items;
  const pageInfo = data?.mlPostsForYou.pageInfo;
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
        txn?.type === OptmisticTransactionType.Post ? (
          <QueuedPost key={txn.txHash} txn={txn} />
        ) : null
      )}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, item) => `${item.post.id}-${index}`}
          data={posts}
          endReached={onEndReached}
          itemContent={(index, item) => (
            <SinglePost
              isFirst={index === 0}
              isLast={index === (posts?.length || 0) - 1}
              post={item.post as Post}
            />
          )}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default ForYou;
