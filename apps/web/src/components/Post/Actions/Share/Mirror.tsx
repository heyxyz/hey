import { useApolloClient } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import hasOptimisticallyMirrored from "@helpers/optimistic/hasOptimisticallyMirrored";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { POST } from "@hey/data/tracking";
import type { MirrorablePublication, OnchainMirrorRequest } from "@hey/lens";
import { TriStateValue, useMirrorOnchainMutation } from "@hey/lens";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import cn from "@hey/ui/cn";
import { useCounter } from "@uidotdev/usehooks";
import type { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useWriteContract } from "wagmi";

interface MirrorProps {
  isLoading: boolean;
  post: MirrorablePublication;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Mirror: FC<MirrorProps> = ({ isLoading, post, setIsLoading }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { addTransaction } = useTransactionStore();
  const hasMirrored =
    post.operations.hasMirrored || hasOptimisticallyMirrored(post.id);

  const [shares, { increment }] = useCounter(
    post.stats.mirrors + post.stats.quotes
  );

  const { cache } = useApolloClient();

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
    __typename?: "LensProfileManagerRelayError" | "RelayError" | "RelaySuccess"
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

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticMirror({ txHash: hash }));
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

  if (post.operations.canMirror === TriStateValue.No) {
    return null;
  }

  const createOnChain = async (request: OnchainMirrorRequest) => {
    const { data } = await mirrorOnchain({ variables: { request } });
    if (data?.mirrorOnchain.__typename === "LensProfileManagerRelayError") {
      return await createOnchainMirrorTypedData({
        variables: { request }
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
      const request: OnchainMirrorRequest = {
        mirrorOn: post?.id
      };

      return await createOnChain(request);
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
