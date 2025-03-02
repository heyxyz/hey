import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import errorToast from "@helpers/errorToast";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type AccountsAvailableRequest,
  type LastLoggedInAccountRequest,
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useHideManagedAccountMutation,
  useUnhideManagedAccountMutation
} from "@hey/indexer";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { useAccount } from "wagmi";

interface ListProps {
  managed?: boolean;
}

const List: FC<ListProps> = ({ managed = false }) => {
  const { address } = useAccount();

  const lastLoggedInAccountRequest: LastLoggedInAccountRequest = { address };
  const accountsAvailableRequest: AccountsAvailableRequest = {
    managedBy: address,
    hiddenFilter: managed
      ? ManagedAccountsVisibility.NoneHidden
      : ManagedAccountsVisibility.HiddenOnly
  };

  const { data, error, fetchMore, loading, refetch } =
    useAccountsAvailableQuery({
      variables: {
        lastLoggedInAccountRequest,
        accountsAvailableRequest
      }
    });

  const [hideManagedAccount, { loading: hiding }] =
    useHideManagedAccountMutation();
  const [unhideManagedAccount, { loading: unhiding }] =
    useUnhideManagedAccountMutation();

  useEffect(() => {
    refetch();
  }, [managed, refetch]);

  const accountsAvailable = data?.accountsAvailable.items;
  const pageInfo = data?.accountsAvailable?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: {
          lastLoggedInAccountRequest,
          accountsAvailableRequest: {
            ...accountsAvailableRequest,
            cursor: pageInfo.next
          }
        }
      });
    }
  };

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        title={
          managed
            ? "Failed to load managed profiles"
            : "Failed to load un-managed profiles"
        }
      />
    );
  }

  if (accountsAvailable?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          managed
            ? "You are not managing any profiles!"
            : "You are not un-managing any profiles!"
        }
      />
    );
  }

  const handleToggleManagement = async (account: string) => {
    try {
      if (managed) {
        await hideManagedAccount({ variables: { request: { account } } });
        toast.success("Account is now un-managed");

        return refetch();
      }

      await unhideManagedAccount({ variables: { request: { account } } });
      toast.success("Account is now managed");

      return refetch();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Virtuoso
      data={accountsAvailable}
      endReached={onEndReached}
      itemContent={(_, accountAvailable) => (
        <div className="flex items-center justify-between py-2">
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={accountAvailable.account}
          />
          {address !== accountAvailable.account.owner && (
            <Button
              disabled={hiding || unhiding}
              onClick={() =>
                handleToggleManagement(accountAvailable.account.address)
              }
              outline
              size="sm"
              variant="danger"
            >
              {managed ? "Un-manage" : "Manage"}
            </Button>
          )}
        </div>
      )}
      useWindowScroll
    />
  );
};

export default List;
