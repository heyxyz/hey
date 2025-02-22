import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  type Account,
  type Group,
  type GroupMembershipRequestsRequest,
  PageSize,
  useGroupMembershipRequestsQuery
} from "@hey/indexer";
import { Button, Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface ListProps {
  group: Group;
}

const List: FC<ListProps> = ({ group }) => {
  const { currentAccount } = useAccountStore();
  const { setShowBanOrUnbanAlert } = useBanAlertStore();

  const request: GroupMembershipRequestsRequest = {
    group: group.address,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useGroupMembershipRequestsQuery({
    skip: !currentAccount?.address,
    variables: { request }
  });

  const membershipRequests = data?.groupMembershipRequests?.items;
  const pageInfo = data?.groupMembershipRequests?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load membership requests" />
    );
  }

  if (membershipRequests?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<CheckCircleIcon className="size-8" />}
        message="Group doesn't have any membership requests!"
      />
    );
  }

  return (
    <Card className="space-y-4">
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, membershipRequest) =>
          `${membershipRequest.account.address}-${index}`
        }
        data={membershipRequests}
        endReached={onEndReached}
        itemContent={(_, bannedAccount) => (
          <div className="flex items-center justify-between p-5">
            <SingleAccount
              hideFollowButton
              hideUnfollowButton
              account={bannedAccount.account as Account}
            />
            <Button
              onClick={() =>
                setShowBanOrUnbanAlert(
                  true,
                  false,
                  bannedAccount.account as Account,
                  group.address
                )
              }
            >
              Approve
            </Button>
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default List;
