import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { FollowersRequest } from "@hey/indexer";
import { PageSize, useFollowersQuery } from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface FollowersProps {
  handle: string;
  address: string;
}

const Followers: FC<FollowersProps> = ({ handle, address }) => {
  const { currentAccount } = useAccountStore();

  const request: FollowersRequest = {
    pageSize: PageSize.Fifty,
    account: address
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !address,
    variables: { request }
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
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

  if (followers?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn't have any followers yet.</span>
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
        title="Failed to load followers"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      data={followers}
      endReached={onEndReached}
      itemContent={(_, follower) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={
              currentAccount?.address === follower.follower.address
            }
            hideUnfollowButton={
              currentAccount?.address === follower.follower.address
            }
            account={follower.follower}
            showBio
            showUserPreview={false}
          />
        </div>
      )}
    />
  );
};

export default Followers;
