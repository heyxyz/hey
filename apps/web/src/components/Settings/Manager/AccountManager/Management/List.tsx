import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import errorToast from "@helpers/errorToast";
import { UsersIcon } from "@heroicons/react/24/outline";
import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfilesManagedRequest
} from "@hey/lens";
import {
  ManagedProfileVisibility,
  useHideManagedProfileMutation,
  useProfilesManagedQuery,
  useUnhideManagedProfileMutation
} from "@hey/lens";
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

  const lastLoggedInProfileRequest: LastLoggedInProfileRequest = {
    for: address
  };

  const profilesManagedRequest: ProfilesManagedRequest = {
    for: address,
    hiddenFilter: managed
      ? ManagedProfileVisibility.NoneHidden
      : ManagedProfileVisibility.HiddenOnly
  };

  const { data, error, fetchMore, loading, refetch } = useProfilesManagedQuery({
    variables: { lastLoggedInProfileRequest, profilesManagedRequest }
  });

  const [hideManagedProfile, { loading: hiding }] =
    useHideManagedProfileMutation();
  const [unhideManagedProfile, { loading: unhiding }] =
    useUnhideManagedProfileMutation();

  useEffect(() => {
    refetch();
  }, [managed, refetch]);

  const accountsManaged = data?.profilesManaged.items;
  const pageInfo = data?.profilesManaged?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: {
          lastLoggedInProfileRequest,
          profilesManagedRequest: {
            ...profilesManagedRequest,
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

  if (accountsManaged?.length === 0) {
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

  const handleToggleManagement = async (profileId: string) => {
    try {
      if (managed) {
        await hideManagedProfile({ variables: { request: { profileId } } });
        toast.success("Account is now un-managed");

        return refetch();
      }

      await unhideManagedProfile({ variables: { request: { profileId } } });
      toast.success("Account is now managed");

      return refetch();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Virtuoso
      computeItemKey={(index, account) => `${account.id}-${index}`}
      data={accountsManaged}
      endReached={onEndReached}
      itemContent={(_, account) => (
        <div className="flex items-center justify-between py-2">
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Profile}
          />
          {address !== account.ownedBy.address && (
            <Button
              disabled={hiding || unhiding}
              onClick={() => handleToggleManagement(account.id)}
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
