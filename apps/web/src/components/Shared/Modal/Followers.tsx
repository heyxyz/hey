import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import type { FollowersRequest, Profile } from "@hey/lens";
import { LimitType, useFollowersQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface FollowersProps {
  handle: string;
  accountId: string;
}

const Followers: FC<FollowersProps> = ({ handle, accountId }) => {
  const { currentAccount } = useAccountStore();

  const request: FollowersRequest = {
    limit: LimitType.TwentyFive,
    of: accountId
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !accountId,
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
      computeItemKey={(index, follower) => `${follower.id}-${index}`}
      data={followers}
      endReached={onEndReached}
      itemContent={(_, follower) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.id === follower.id}
            hideUnfollowButton={currentAccount?.id === follower.id}
            account={follower as Profile}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Followers}
          />
        </div>
      )}
    />
  );
};

export default Followers;
