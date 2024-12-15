import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import type { Account } from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface CollectorsProps {
  postId: string;
}

const Collectors: FC<CollectorsProps> = ({ postId }) => {
  const { currentAccount } = useAccountStore();

  const request: WhoActedOnPublicationRequest = {
    limit: LimitType.TwentyFive,
    on: postId,
    where: { anyOf: [{ category: OpenActionCategoryType.Collect }] }
  };

  const { data, error, fetchMore, loading } = useWhoActedOnPublicationQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.whoActedOnPublication?.items;
  const pageInfo = data?.whoActedOnPublication?.pageInfo;
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
          icon={<ShoppingBagIcon className="size-8" />}
          message="No collectors."
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
        title="Failed to load collectors"
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
          />
        </div>
      )}
    />
  );
};

export default Collectors;
