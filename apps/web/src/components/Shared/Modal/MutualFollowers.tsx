import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { MutualFollowersRequest, Profile } from "@hey/lens";
import { LimitType, useMutualFollowersQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MutualFollowersListProps {
  handle: string;
  accountId: string;
}

const MutualFollowers: FC<MutualFollowersListProps> = ({
  handle,
  accountId
}) => {
  const { currentAccount } = useAccountStore();

  const request: MutualFollowersRequest = {
    limit: LimitType.TwentyFive,
    observer: currentAccount?.id,
    viewing: accountId
  };

  const { data, error, fetchMore, loading } = useMutualFollowersQuery({
    skip: !accountId,
    variables: { request }
  });

  const mutualFollowers = data?.mutualFollowers?.items;
  const pageInfo = data?.mutualFollowers?.pageInfo;
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

  if (mutualFollowers?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">{handle}</span>
            <span>doesn't have any mutual followers.</span>
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
        title="Failed to load mutual followers"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      computeItemKey={(index, mutualFollower) =>
        `${mutualFollower.id}-${index}`
      }
      data={mutualFollowers}
      endReached={onEndReached}
      itemContent={(_, mutualFollower) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.id === mutualFollower.id}
            hideUnfollowButton={currentAccount?.id === mutualFollower.id}
            account={mutualFollower as Profile}
            showBio
            showUserPreview={false}
          />
        </div>
      )}
    />
  );
};

export default MutualFollowers;
