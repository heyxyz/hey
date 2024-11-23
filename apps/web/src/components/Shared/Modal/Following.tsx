import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import type { FollowingRequest, Profile } from "@hey/lens";
import { LimitType, useFollowingQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface FollowingProps {
  handle: string;
  accountId: string;
}

const Following: FC<FollowingProps> = ({ handle, accountId }) => {
  const request: FollowingRequest = {
    for: accountId,
    limit: LimitType.TwentyFive
  };
  const { currentAccount } = useAccountStore();

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !accountId,
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
      computeItemKey={(index, following) => `${following.id}-${index}`}
      data={followings}
      endReached={onEndReached}
      itemContent={(_, following) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.id === following.id}
            hideUnfollowButton={currentAccount?.id === following.id}
            account={following as Profile}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Following}
          />
        </div>
      )}
    />
  );
};

export default Following;
