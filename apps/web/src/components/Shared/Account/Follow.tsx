import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
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
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

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
  const { data: walletClient } = useWalletClient();

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
      fields: { isFollowedByMe: () => true },
      id: cache.identify(account.operations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    addTransaction(generateOptimisticFollow({ txHash: hash }));
    setIsLoading(false);
    toast.success("Followed");
  };

  const [follow] = useFollowMutation({
    onCompleted: async ({ follow }) => {
      if (follow.__typename === "FollowResponse") {
        return onCompleted(follow.hash);
      }

      if (walletClient) {
        if (follow.__typename === "SponsoredTransactionRequest") {
          const hash = await sendEip712Transaction(walletClient, {
            account: walletClient.account,
            ...sponsoredTransactionData(follow.raw)
          });

          return onCompleted(hash);
        }

        if (follow.__typename === "SelfFundedTransactionRequest") {
          const hash = await sendTransaction(walletClient, {
            account: walletClient.account,
            ...selfFundedTransactionData(follow.raw)
          });

          return onCompleted(hash);
        }
      }

      if (follow.__typename === "TransactionWillFail") {
        return toast.error(follow.reason);
      }
    }
  });

  const handleCreateFollow = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);
    try {
      return await follow({
        variables: { request: { account: account.address } }
      });
    } catch (error) {
      setIsLoading(false);
      errorToast(error);
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
