import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { AccountLinkSource } from "@hey/data/tracking";
import {
  type Account,
  type GroupMembersRequest,
  PageSize,
  useGroupMembersQuery
} from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MembersProps {
  address: string;
}

const Members: FC<MembersProps> = ({ address }) => {
  const { currentAccount } = useAccountStore();

  const request: GroupMembersRequest = {
    pageSize: PageSize.Fifty,
    group: address
  };

  const { data, loading, error, fetchMore } = useGroupMembersQuery({
    skip: !address,
    variables: { request }
  });

  const groupMembers = data?.groupMembers?.items;
  const pageInfo = data?.groupMembers?.pageInfo;
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

  if (groupMembers?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message="Group doesn't have any members."
        hideCard
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load members"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      computeItemKey={(index, member) => `${member.address}-${index}`}
      data={groupMembers}
      endReached={onEndReached}
      itemContent={(_, member) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={currentAccount?.address === member.address}
            hideUnfollowButton={currentAccount?.address === member.address}
            account={member as Account}
            showBio
            showUserPreview={false}
            source={AccountLinkSource.Followers}
          />
        </div>
      )}
    />
  );
};

export default Members;
