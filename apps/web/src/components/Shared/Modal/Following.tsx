import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { FollowingRequest } from "@hey/indexer";
import { PageSize, useFollowingQuery } from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface FollowingProps {
  handle: string;
  address: string;
}

const Following: FC<FollowingProps> = ({ handle, address }) => {
  const request: FollowingRequest = {
    pageSize: PageSize.Fifty,
    account: address
  };
  const { currentAccount } = useAccountStore();

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !address,
    variables: { request }
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
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

  if (followings?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn't follow anyone.</span>
          </div>
        }
        hideCard
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load following"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      data={followings}
      endReached={onEndReached}
      itemContent={(_, following) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={
              currentAccount?.address === following.following.address
            }
            hideUnfollowButton={
              currentAccount?.address === following.following.address
            }
            account={following.following}
            showBio
            showUserPreview={false}
          />
        </div>
      )}
    />
  );
};

export default Following;
