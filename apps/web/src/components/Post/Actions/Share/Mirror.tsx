import { useApolloClient } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import checkAndToastDispatcherError from "@helpers/checkAndToastDispatcherError";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import hasOptimisticallyMirrored from "@helpers/optimistic/hasOptimisticallyMirrored";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { POST } from "@hey/data/tracking";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import getSignature from "@hey/helpers/getSignature";
import type {
  MirrorablePublication,
  MomokaMirrorRequest,
  OnchainMirrorRequest
} from "@hey/lens";
import {
  TriStateValue,
  useBroadcastOnMomokaMutation,
  useBroadcastOnchainMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnMomokaMutation,
  useMirrorOnchainMutation
} from "@hey/lens";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import cn from "@hey/ui/cn";
import { useCounter } from "@uidotdev/usehooks";
import type { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useNonceStore } from "src/store/non-persisted/useNonceStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useSignTypedData, useWriteContract } from "wagmi";

interface MirrorProps {
  isLoading: boolean;
  post: MirrorablePublication;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Mirror: FC<MirrorProps> = ({ isLoading, post, setIsLoading }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
  const { addTransaction } = useTransactionStore();
  const hasMirrored =
    post.operations.hasMirrored || hasOptimisticallyMirrored(post.id);

  const [shares, { increment }] = useCounter(
    post.stats.mirrors + post.stats.quotes
  );

  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentAccount);

  const generateOptimisticMirror = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }): OptimisticTransaction => {
    return {
      mirrorOn: post?.id,
      txHash,
      txId,
      type: OptmisticPostType.Mirror
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasMirrored: true };
        }
      },
      id: cache.identify(post)
    });
    cache.modify({
      fields: { mirrors: () => shares + 1 },
      id: cache.identify(post.stats)
    });
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | "CreateMomokaPublicationResult"
      | "LensProfileManagerRelayError"
      | "RelayError"
      | "RelaySuccess"
  ) => {
    if (
      __typename === "RelayError" ||
      __typename === "LensProfileManagerRelayError"
    ) {
      return onError();
    }

    setIsLoading(false);
    increment();
    updateCache();
    toast.success("Post has been mirrored!");
    Leafwatch.track(POST.MIRROR, { postId: post.id });
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticMirror({ txHash: hash }));
        incrementLensHubOnchainSigNonce();
        onCompleted();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "mirror"
    });
  };

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      onCompleted(broadcastOnMomoka.__typename);
    },
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      if (broadcastOnchain.__typename === "RelaySuccess") {
        addTransaction(
          generateOptimisticMirror({ txId: broadcastOnchain.txId })
        );
      }
      onCompleted(broadcastOnchain.__typename);
    },
    onError
  });

  const typedDataGenerator = async (
    generatedData: any,
    isMomokaPublication = false
  ) => {
    const { id, typedData } = generatedData;
    await handleWrongNetwork();

    if (canBroadcast) {
      const signature = await signTypedDataAsync(getSignature(typedData));
      if (isMomokaPublication) {
        return await broadcastOnMomoka({
          variables: { request: { id, signature } }
        });
      }
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === "RelayError") {
        return await write({ args: [typedData.value] });
      }
      incrementLensHubOnchainSigNonce();

      return;
    }

    return await write({ args: [typedData.value] });
  };

  // On-chain typed data generation
  const [createOnchainMirrorTypedData] =
    useCreateOnchainMirrorTypedDataMutation({
      onCompleted: async ({ createOnchainMirrorTypedData }) =>
        await typedDataGenerator(createOnchainMirrorTypedData),
      onError
    });

  // Momoka typed data generation
  const [createMomokaMirrorTypedData] = useCreateMomokaMirrorTypedDataMutation({
    onCompleted: async ({ createMomokaMirrorTypedData }) =>
      await typedDataGenerator(createMomokaMirrorTypedData, true),
    onError
  });

  // Onchain mutations
  const [mirrorOnchain] = useMirrorOnchainMutation({
    onCompleted: ({ mirrorOnchain }) => {
      if (mirrorOnchain.__typename === "RelaySuccess") {
        addTransaction(generateOptimisticMirror({ txId: mirrorOnchain.txId }));
      }
      onCompleted(mirrorOnchain.__typename);
    },
    onError
  });

  // Momoka mutations
  const [mirrorOnMomoka] = useMirrorOnMomokaMutation({
    onCompleted: ({ mirrorOnMomoka }) => onCompleted(mirrorOnMomoka.__typename),
    onError
  });

  if (post.operations.canMirror === TriStateValue.No) {
    return null;
  }

  const createOnMomka = async (request: MomokaMirrorRequest) => {
    const { data } = await mirrorOnMomoka({ variables: { request } });

    if (data?.mirrorOnMomoka?.__typename === "LensProfileManagerRelayError") {
      const shouldProceed = checkAndToastDispatcherError(
        data.mirrorOnMomoka.reason
      );

      if (!shouldProceed) {
        return;
      }

      return await createMomokaMirrorTypedData({ variables: { request } });
    }
  };

  const createOnChain = async (request: OnchainMirrorRequest) => {
    const { data } = await mirrorOnchain({ variables: { request } });
    if (data?.mirrorOnchain.__typename === "LensProfileManagerRelayError") {
      return await createOnchainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    }
  };

  const handleCreateMirror = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const request: MomokaMirrorRequest | OnchainMirrorRequest = {
        mirrorOn: post?.id
      };

      if (post.momoka?.proof) {
        if (canUseLensManager) {
          return await createOnMomka(request);
        }

        return await createMomokaMirrorTypedData({ variables: { request } });
      }

      if (canUseLensManager) {
        return await createOnChain(request);
      }

      return await createOnchainMirrorTypedData({
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
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          hasMirrored ? "text-green-500" : "",
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm"
        )
      }
      disabled={isLoading}
      onClick={handleCreateMirror}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="size-4" />
        <div>{hasMirrored ? "Mirror again" : "Mirror"}</div>
      </div>
    </MenuItem>
  );
};

export default Mirror;
