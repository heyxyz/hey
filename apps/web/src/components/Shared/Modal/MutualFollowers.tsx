import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type Account,
  type FollowersYouKnowRequest,
  useFollowersYouKnowQuery
} from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MutualFollowersListProps {
  handle: string;
  address: string;
}

const MutualFollowers: FC<MutualFollowersListProps> = ({ handle, address }) => {
  const { currentAccount } = useAccountStore();

  const request: FollowersYouKnowRequest = {
    observer: currentAccount?.address,
    target: address
  };

  const { data, error, fetchMore, loading } = useFollowersYouKnowQuery({
    skip: !address,
    variables: { request }
  });

  const followersYouKnow = data?.followersYouKnow?.items;
  const pageInfo = data?.followersYouKnow?.pageInfo;
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

  if (followersYouKnow?.length === 0) {
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
      computeItemKey={(index, follower) =>
        `${follower.follower.address}-${index}`
      }
      data={followersYouKnow}
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
            account={follower.follower as Account}
            showBio
            showUserPreview={false}
          />
        </div>
      )}
    />
  );
};

export default MutualFollowers;
