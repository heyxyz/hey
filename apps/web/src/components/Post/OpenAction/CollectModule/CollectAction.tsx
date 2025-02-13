import { useApolloClient } from "@apollo/client";
import LoginButton from "@components/Shared/LoginButton";
import NoBalanceError from "@components/Shared/NoBalanceError";
import errorToast from "@helpers/errorToast";
import getCurrentSession from "@helpers/getCurrentSession";
import { COLLECT_FEES_ADDRESS } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import getCollectActionData from "@hey/helpers/getCollectActionData";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { useExecutePostActionMutation, type Post, type PostAction } from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import { Button, WarningMessage } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";
import { formatUnits } from "viem";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useAccount, useBalance, useWalletClient } from "wagmi";

interface CollectActionProps {
  buttonTitle?: string;
  className?: string;
  countOpenActions: number;
  forceShowCollect?: boolean;
  noBalanceErrorMessages?: ReactNode;
  onCollectSuccess?: () => void;
  postAction: PostAction;
  post: Post;
}

const CollectAction: FC<CollectActionProps> = ({
  buttonTitle = "Collect now",
  className = "",
  countOpenActions,
  forceShowCollect = false,
  noBalanceErrorMessages,
  onCollectSuccess = () => { },
  postAction,
  post
}) => {
  const collectModule = getCollectActionData(postAction as any);
  const { address: sessionAccountAddress } = getCurrentSession();

  const { isSuspended } = useAccountStatus();
  const { hasOptimisticallyCollected } = useTransactionStore();
  const { data: walletClient } = useWalletClient();

  const [isLoading, setIsLoading] = useState(false);
  const [hasActed, setHasActed] = useState(
    collectModule?.amount
      ? false
      : post.operations?.hasReacted || hasOptimisticallyCollected(post.id)
  );

  const { address } = useAccount();
  const { cache } = useApolloClient();

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = collectModule?.collectLimit;
  const amount = collectModule?.amount as number;
  const assetAddress = collectModule?.assetAddress as any;
  const assetDecimals = collectModule?.assetDecimals as number;
  const isAllCollected = collectLimit
    ? countOpenActions >= collectLimit
    : false;
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const isFreeCollectModule = !amount;
  const canCollect = forceShowCollect
    ? true
    : !hasActed || !isFreeCollectModule;

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      collectOn: post?.id,
      txHash,
      type: OptmisticTransactionType.Collect
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasActed: { value: true } };
        }
      },
      id: cache.identify(post)
    });
    cache.modify({
      fields: {
        stats: (existingData) => ({
          ...existingData,
          countOpenActions: countOpenActions + 1
        })
      },
      id: cache.identify(post)
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (hash: string) => {
    // Should not disable the button if it's a paid collect module
    setHasActed(amount <= 0);
    setIsLoading(false);
    updateTransactions({ txHash: hash });
    onCollectSuccess?.();
    updateCache();
    toast.success("Collected");
  };

  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: assetAddress
  });

  let hasAmount = false;
  if (
    balanceData &&
    Number.parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  // Act
  const [executePostAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted(executePostAction.hash);
      }

      if (walletClient) {
        try {
          if (executePostAction.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(executePostAction.raw)
            });

            return onCompleted(hash);
          }

          if (executePostAction.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(executePostAction.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (executePostAction.__typename === "TransactionWillFail") {
        return toast.error(executePostAction.reason);
      }
    },
    onError
  });

  const handleCreateCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await executePostAction({
      variables: {
        request: {
          post: post.id,
          action: {
            simpleCollect: {
              selected: null,
              referrals: [
                {
                  address: COLLECT_FEES_ADDRESS,
                  percent: 5
                }]
            }
          }
        }
      }
    });
  };

  if (!sessionAccountAddress) {
    return (
      <LoginButton
        className="mt-5 w-full justify-center"
        title="Login to Collect"
      />
    );
  }

  if (!canCollect) {
    return null;
  }

  if (isAllCollected || isSaleEnded) {
    return null;
  }

  if (!hasAmount) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={
          <NoBalanceError
            errorMessage={noBalanceErrorMessages}
            moduleAmount={amount}
          />
        }
      />
    );
  }

  return (
    <Button
      className={cn("mt-5 w-full justify-center", className)}
      disabled={isLoading}
      onClick={handleCreateCollect}
    >
      {buttonTitle}
    </Button>
  );
};

export default CollectAction;
