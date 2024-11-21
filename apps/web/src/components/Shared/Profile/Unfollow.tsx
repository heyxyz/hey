import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { ACCOUNT } from "@hey/data/tracking";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import getSignature from "@hey/helpers/getSignature";
import type { Profile, UnfollowRequest } from "@hey/lens";
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from "@hey/lens";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Button } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useNonceStore } from "src/store/non-persisted/useNonceStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useSignTypedData, useWriteContract } from "wagmi";

interface UnfollowProps {
  buttonClassName: string;
  account: Profile;
  small: boolean;
  title: string;
}

const Unfollow: FC<UnfollowProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const { pathname } = useRouter();
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { incrementLensHubOnchainSigNonce, lensHubOnchainSigNonce } =
    useNonceStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { addTransaction, isFollowPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentAccount);

  const generateOptimisticUnfollow = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }): OptimisticTransaction => {
    return {
      txHash,
      txId,
      type: OptmisticPostType.Unfollow,
      unfollowOn: account.id
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: false };
        }
      },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = (
    __typename?: "LensProfileManagerRelayError" | "RelayError" | "RelaySuccess"
  ) => {
    if (
      __typename === "RelayError" ||
      __typename === "LensProfileManagerRelayError"
    ) {
      return;
    }

    updateCache();
    setIsLoading(false);
    toast.success("Unfollowed");
    Leafwatch.track(ACCOUNT.UNFOLLOW, { path: pathname, target: account?.id });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticUnfollow({ txHash: hash }));
        onCompleted();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "unfollow"
    });
  };

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      if (broadcastOnchain.__typename === "RelaySuccess") {
        addTransaction(
          generateOptimisticUnfollow({ txId: broadcastOnchain.txId })
        );
      }
      onCompleted(broadcastOnchain.__typename);
    }
  });
  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { id, typedData } = createUnfollowTypedData;
      const { idsOfProfilesToUnfollow, unfollowerProfileId } = typedData.value;
      const args = [unfollowerProfileId, idsOfProfilesToUnfollow];
      await handleWrongNetwork();

      if (canBroadcast) {
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === "RelayError") {
          return await write({ args });
        }
        incrementLensHubOnchainSigNonce();

        return;
      }

      return await write({ args });
    },
    onError
  });

  const [unfollow] = useUnfollowMutation({
    onCompleted: ({ unfollow }) => {
      if (unfollow.__typename === "RelaySuccess") {
        addTransaction(generateOptimisticUnfollow({ txId: unfollow.txId }));
      }
      onCompleted(unfollow.__typename);
    },
    onError
  });

  const unfollowViaLensManager = async (request: UnfollowRequest) => {
    const { data } = await unfollow({ variables: { request } });
    if (data?.unfollow?.__typename === "LensProfileManagerRelayError") {
      return await createUnfollowTypedData({ variables: { request } });
    }
  };

  const handleCreateUnfollow = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const request: UnfollowRequest = { unfollow: [account?.id] };

      if (canUseLensManager) {
        return await unfollowViaLensManager(request);
      }

      return await createUnfollowTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isLoading || isFollowPending(account.id)}
      onClick={handleCreateUnfollow}
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Unfollow;
