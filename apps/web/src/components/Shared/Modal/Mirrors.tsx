import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import type { Profile, ProfilesRequest } from "@hey/lens";
import { LimitType, useProfilesQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MirrorsProps {
  postId: string;
}

const Mirrors: FC<MirrorsProps> = ({ postId }) => {
  const { currentAccount } = useAccountStore();

  const request: ProfilesRequest = {
    limit: LimitType.TwentyFive,
    where: { whoMirroredPublication: postId }
  };

  const { data, error, fetchMore, loading } = useProfilesQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;
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
      computeItemKey={(index, account) => `${account.id}-${index}`}
      data={accounts}
      endReached={onEndReached}
      itemContent={(_, account) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.id === account.id}
            hideUnfollowButton={currentAccount?.id === account.id}
            account={account as Profile}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Mirrors}
          />
        </div>
      )}
    />
  );
};

export default Mirrors;
