import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  type AccountsBlockedRequest,
  PageSize,
  useAccountsBlockedQuery
} from "@hey/indexer";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useBlockAlertStore } from "src/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const List: FC = () => {
  const { currentAccount } = useAccountStore();
  const { setShowBlockOrUnblockAlert } = useBlockAlertStore();

  const request: AccountsBlockedRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountsBlockedQuery({
    skip: !currentAccount?.address,
    variables: { request }
  });

  const accountsBlocked = data?.accountsBlocked?.items;
  const pageInfo = data?.accountsBlocked?.pageInfo;
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
      <ErrorMessage error={error} title="Failed to load blocked accounts" />
    );
  }

  if (accountsBlocked?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<NoSymbolIcon className="size-8" />}
        message="You are not blocking any accounts!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Virtuoso
        className="virtual-divider-list-window"
        data={accountsBlocked}
        endReached={onEndReached}
        itemContent={(_, accountBlocked) => (
          <div className="flex items-center justify-between p-5">
            <SingleAccount
              hideFollowButton
              hideUnfollowButton
              account={accountBlocked.account}
            />
            <Button
              onClick={() =>
                setShowBlockOrUnblockAlert(true, accountBlocked.account)
              }
            >
              Unblock
            </Button>
          </div>
        )}
        useWindowScroll
      />
    </div>
  );
};

export default List;
