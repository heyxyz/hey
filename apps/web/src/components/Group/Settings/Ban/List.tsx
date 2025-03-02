import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  type GroupBannedAccountsRequest,
  type GroupFragment,
  PageSize,
  useGroupBannedAccountsQuery
} from "@hey/indexer";
import { Button, Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface ListProps {
  group: GroupFragment;
}

const List: FC<ListProps> = ({ group }) => {
  const { currentAccount } = useAccountStore();
  const { setShowBanOrUnbanAlert } = useBanAlertStore();

  const request: GroupBannedAccountsRequest = {
    group: group.address,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useGroupBannedAccountsQuery({
    skip: !currentAccount?.address,
    variables: { request }
  });

  const bannedAccounts = data?.groupBannedAccounts?.items;
  const pageInfo = data?.groupBannedAccounts?.pageInfo;
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
    return <ErrorMessage error={error} title="Failed to load banned members" />;
  }

  if (bannedAccounts?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<NoSymbolIcon className="size-8" />}
        message="Group is not banning any members!"
      />
    );
  }

  return (
    <Card className="space-y-4">
      <Virtuoso
        className="virtual-divider-list-window"
        data={bannedAccounts}
        endReached={onEndReached}
        itemContent={(_, bannedAccount) => (
          <div className="flex items-center justify-between p-5">
            <SingleAccount
              hideFollowButton
              hideUnfollowButton
              account={bannedAccount.account}
            />
            <Button
              onClick={() =>
                setShowBanOrUnbanAlert(
                  true,
                  false,
                  bannedAccount.account,
                  group.address
                )
              }
            >
              Unban
            </Button>
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default List;
