import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import type { Profile, WhoHaveBlockedRequest } from "@hey/lens";
import { LimitType, useWhoHaveBlockedQuery } from "@hey/lens";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const List: FC = () => {
  const { currentAccount } = useAccountStore();
  const { setShowBlockOrUnblockAlert } = useGlobalAlertStateStore();

  const request: WhoHaveBlockedRequest = { limit: LimitType.TwentyFive };
  const { data, error, fetchMore, loading } = useWhoHaveBlockedQuery({
    skip: !currentAccount?.id,
    variables: { request }
  });

  const whoHaveBlocked = data?.whoHaveBlocked?.items;
  const pageInfo = data?.whoHaveBlocked?.pageInfo;
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
      <ErrorMessage error={error} title="Failed to load blocked profiles" />
    );
  }

  if (whoHaveBlocked?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<NoSymbolIcon className="size-8" />}
        message="You are not blocking any profiles!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, account) => `${account.id}-${index}`}
        data={whoHaveBlocked}
        endReached={onEndReached}
        itemContent={(_, account) => (
          <div className="flex items-center justify-between p-5">
            <SingleAccount
              hideFollowButton
              hideUnfollowButton
              account={account as Profile}
            />
            <Button
              onClick={() =>
                setShowBlockOrUnblockAlert(true, account as Profile)
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
