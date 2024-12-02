import { useApolloClient } from "@apollo/client";
import LazySingleAccount from "@components/Shared/LazySingleAccount";
import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import {
  type AccountManagersRequest,
  PageSize,
  useAccountManagersQuery
} from "@hey/indexer";
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import type { Address } from "viem";
import { useWriteContract } from "wagmi";

const List: FC = () => {
  const { isSuspended } = useAccountStatus();
  const [removingAddress, setRemovingAddress] = useState<Address | null>(null);
  const { cache } = useApolloClient();

  const onCompleted = (
    __typename?: "LensProfileManagerRelayError" | "RelayError" | "RelaySuccess"
  ) => {
    if (
      __typename === "RelayError" ||
      __typename === "LensProfileManagerRelayError"
    ) {
      return;
    }

    cache.evict({ id: `ProfilesManagedResult:${removingAddress}` });
    toast.success("Manager removed");
    Leafwatch.track(SETTINGS.MANAGER.REMOVE_MANAGER);
  };

  const onError = (error: any) => {
    errorToast(error);
    setRemovingAddress(null);
  };

  const request: AccountManagersRequest = { pageSize: PageSize.Fifty };
  const { data, error, fetchMore, loading } = useAccountManagersQuery({
    variables: { request }
  });

  const { writeContractAsync } = useWriteContract({
    mutation: { onError, onSuccess: () => onCompleted() }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "changeDelegatedExecutorsConfig"
    });
  };

  const handleRemoveManager = async (address: Address) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setRemovingAddress(address);
      return await createChangeProfileManagersTypedData({
        variables: {
          request: {
            changeManagers: [
              { action: ChangeProfileManagerActionType.Remove, address }
            ]
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const accountManagers = data?.accountManagers.items.filter(
    (item) => !item.isLensManager
  );
  const pageInfo = data?.accountManagers?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load profile managers" />
    );
  }

  if (accountManagers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UserCircleIcon className="size-8" />}
        message="No profile managers added!"
      />
    );
  }

  return (
    <Virtuoso
      computeItemKey={(index, accountManager) =>
        `${accountManager.manager}-${index}`
      }
      data={accountManagers}
      endReached={onEndReached}
      itemContent={(_, accountManager) => (
        <div className="flex items-center justify-between py-2">
          <LazySingleAccount address={accountManager.manager} />
          <Button
            disabled={removingAddress === accountManager.manager}
            onClick={() => handleRemoveManager(accountManager.manager)}
            outline
          >
            Remove
          </Button>
        </div>
      )}
      useWindowScroll
    />
  );
};

export default List;
