import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { ACCOUNT } from "@hey/data/tracking";
import { type Account, useFollowMutation } from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Button } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useWriteContract } from "wagmi";

interface FollowProps {
  buttonClassName: string;
  account: Account;
  small: boolean;
  title: string;
}

const Follow: FC<FollowProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const { pathname } = useRouter();
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { addTransaction, isUnfollowPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();

  const generateOptimisticFollow = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      followOn: account.address,
      txHash,
      type: OptmisticPostType.Follow
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: true };
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
    toast.success("Followed");
    Leafwatch.track(ACCOUNT.FOLLOW, { path: pathname, target: account?.id });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticFollow({ txHash: hash }));
        onCompleted();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "follow"
    });
  };

  const [follow] = useFollowMutation({
    onCompleted: async ({ follow }) => {
      if (follow.__typename === "FollowResponse") {
        addTransaction(generateOptimisticFollow({ txHash: follow.hash }));
        onCompleted(follow.__typename);
      } else {
        await write({ args: [account.address] });
      }
    },
    onError
  });

  const handleCreateFollow = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      return await follow({
        variables: { request: { account: account.address } }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isLoading || isUnfollowPending(account.address)}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
