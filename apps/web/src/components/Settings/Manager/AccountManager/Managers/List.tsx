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
import { Button, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { Address } from "viem";
import { useWriteContract } from "wagmi";

const List: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [removingAddress, setRemovingAddress] = useState<Address | null>(null);

  const handleWrongNetwork = useHandleWrongNetwork();
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

  const request: ProfileManagersRequest = { for: currentAccount?.address };
  const { data, error, fetchMore, loading } = useProfileManagersQuery({
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

  const profileManagers = data?.profileManagers.items.filter(
    (item) => !item.isLensManager
  );
  const pageInfo = data?.profileManagers?.pageInfo;
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

  if (profileManagers?.length === 0) {
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
      computeItemKey={(index, manager) => `${manager.address}-${index}`}
      data={profileManagers}
      endReached={onEndReached}
      itemContent={(_, manager) => (
        <div className="flex items-center justify-between py-2">
          <LazySingleAccount address={manager.address} />
          <Button
            disabled={removingAddress === manager.address}
            onClick={() => handleRemoveManager(manager.address)}
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
