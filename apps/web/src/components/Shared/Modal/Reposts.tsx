import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import {
  type Account,
  PageSize,
  PostReferenceType,
  useWhoReferencedPostQuery,
  type WhoReferencedPostRequest
} from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface RepostsProps {
  postId: string;
}

const Reposts: FC<RepostsProps> = ({ postId }) => {
  const { currentAccount } = useAccountStore();

  const request: WhoReferencedPostRequest = {
    pageSize: PageSize.Fifty,
    post: postId,
    referenceTypes: [PostReferenceType.RepostOf]
  };

  const { data, error, fetchMore, loading } = useWhoReferencedPostQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.whoReferencedPost?.items;
  const pageInfo = data?.whoReferencedPost?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <AccountListShimmer />;
  }

  if (accounts?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<ArrowsRightLeftIcon className="size-8" />}
          message="No mirrors."
          hideCard
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mirrors"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      computeItemKey={(index, account) => `${account.address}-${index}`}
      data={accounts}
      endReached={onEndReached}
      itemContent={(_, account) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.address === account.address}
            hideUnfollowButton={currentAccount?.address === account.address}
            account={account as Account}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Mirrors}
          />
        </div>
      )}
    />
  );
};

export default Reposts;