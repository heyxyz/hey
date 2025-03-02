import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type GroupFragment,
  type GroupMembersRequest,
  PageSize,
  useGroupMembersQuery
} from "@hey/indexer";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Ban from "./Ban";

interface MembersProps {
  group: GroupFragment;
}

const Members: FC<MembersProps> = ({ group }) => {
  const { currentAccount } = useAccountStore();

  const request: GroupMembersRequest = {
    pageSize: PageSize.Fifty,
    group: group.address
  };

  const { data, loading, error, fetchMore } = useGroupMembersQuery({
    skip: !group.address,
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
      data={groupMembers}
      endReached={onEndReached}
      itemContent={(_, member) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={
              currentAccount?.address === member.account.address
            }
            hideUnfollowButton={
              currentAccount?.address === member.account.address
            }
            account={member.account}
            showBio
            showUserPreview={false}
            menu={<Ban group={group} account={member.account} />}
          />
        </div>
      )}
    />
  );
};

export default Members;
