import type { ApolloCache } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { ACCOUNT } from "@hey/data/tracking";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import getAccount from "@hey/helpers/getAccount";
import getSignature from "@hey/helpers/getSignature";
import type { BlockRequest, UnblockRequest } from "@hey/lens";
import {
  useBlockMutation,
  useBroadcastOnchainMutation,
  useCreateBlockProfilesTypedDataMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation
} from "@hey/lens";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useNonceStore } from "src/store/non-persisted/useNonceStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useSignTypedData, useWriteContract } from "wagmi";

const BlockOrUnBlockAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingorUnblockingProfile,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useGlobalAlertStateStore();
  const { incrementLensHubOnchainSigNonce, lensHubOnchainSigNonce } =
    useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingProfile?.operations.isBlockedByMe.value
  );

  const { isSuspended } = useAccountStatus();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentAccount);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        isBlockedByMe: (existingValue) => {
          return { ...existingValue, value: !hasBlocked };
        }
      },
      id: `ProfileOperations:${blockingorUnblockingProfile?.id}`
    });
    cache.evict({ id: `Profile:${blockingorUnblockingProfile?.id}` });
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

    setIsLoading(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false, null);
    toast.success(hasBlocked ? "Unblocked" : "Blocked");
    Leafwatch.track(hasBlocked ? ACCOUNT.BLOCK : ACCOUNT.UNBLOCK, {
      accountId: blockingorUnblockingProfile?.id
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { writeContractAsync } = useWriteContract({
    mutation: { onError, onSuccess: () => onCompleted() }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "setBlockStatus"
    });
  };

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
    await handleWrongNetwork();
    incrementLensHubOnchainSigNonce();

    if (canBroadcast) {
      const signature = await signTypedDataAsync(getSignature(typedData));
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === "RelayError") {
        return await write({ args: [typedData.value] });
      }

      return;
    }

    return await write({ args: [typedData.value] });
  };

  const [createBlockProfilesTypedData] =
    useCreateBlockProfilesTypedDataMutation({
      onCompleted: async ({ createBlockProfilesTypedData }) =>
        await typedDataGenerator(createBlockProfilesTypedData),
      onError,
      update: updateCache
    });

  const [createUnblockProfilesTypedData] =
    useCreateUnblockProfilesTypedDataMutation({
      onCompleted: async ({ createUnblockProfilesTypedData }) =>
        await typedDataGenerator(createUnblockProfilesTypedData),
      onError,
      update: updateCache
    });

  const [blockProfile] = useBlockMutation({
    onCompleted: ({ block }) => onCompleted(block.__typename),
    onError,
    update: updateCache
  });

  const [unBlockProfile] = useUnblockMutation({
    onCompleted: ({ unblock }) => onCompleted(unblock.__typename),
    onError,
    update: updateCache
  });

  const blockViaLensManager = async (request: BlockRequest) => {
    const { data } = await blockProfile({ variables: { request } });

    if (data?.block.__typename === "LensProfileManagerRelayError") {
      return await createBlockProfilesTypedData({ variables: { request } });
    }
  };

  const unBlockViaLensManager = async (request: UnblockRequest) => {
    const { data } = await unBlockProfile({ variables: { request } });

    if (data?.unblock.__typename === "LensProfileManagerRelayError") {
      return await createUnblockProfilesTypedData({ variables: { request } });
    }
  };

  const blockOrUnblock = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const request: BlockRequest | UnblockRequest = {
        profiles: [blockingorUnblockingProfile?.id]
      };

      // Block
      if (hasBlocked) {
        if (canUseLensManager) {
          return await unBlockViaLensManager(request);
        }

        return await createUnblockProfilesTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request
          }
        });
      }

      // Unblock
      if (canUseLensManager) {
        return await blockViaLensManager(request);
      }

      return await createBlockProfilesTypedData({
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
    <Alert
      confirmText={hasBlocked ? "Unblock" : "Block"}
      description={`Are you sure you want to ${
        hasBlocked ? "un-block" : "block"
      } ${getAccount(blockingorUnblockingProfile).slugWithPrefix}?`}
      isDestructive
      isPerformingAction={isLoading}
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Profile"
    />
  );
};

export default BlockOrUnBlockAccount;
