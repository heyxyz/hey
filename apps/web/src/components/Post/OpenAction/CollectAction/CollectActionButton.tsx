import { useApolloClient } from "@apollo/client";
import LoginButton from "@components/Shared/LoginButton";
import NoBalanceError from "@components/Shared/NoBalanceError";
import errorToast from "@helpers/errorToast";
import getCurrentSession from "@helpers/getCurrentSession";
import { Errors } from "@hey/data/errors";
import getCollectActionData from "@hey/helpers/getCollectActionData";
import {
  type Post,
  type PostAction,
  useExecutePostActionMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, WarningMessage } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";
import { type Address, formatUnits } from "viem";
import { useBalance } from "wagmi";

interface CollectActionButtonProps {
  countOpenActions: number;
  onCollectSuccess?: () => void;
  postAction: PostAction;
  post: Post;
}

const CollectActionButton: FC<CollectActionButtonProps> = ({
  countOpenActions,
  onCollectSuccess = () => {},
  postAction,
  post
}) => {
  const collectAction = getCollectActionData(postAction as any);
  const { address: sessionAccountAddress } = getCurrentSession();

  const { isSuspended } = useAccountStatus();
  const { hasOptimisticallyCollected } = useTransactionStore();
  const { handleTransactionLifecycle } = useTransactionLifecycle();

  const [isLoading, setIsLoading] = useState(false);
  const [hasActed, setHasActed] = useState(
    collectAction?.amount
      ? false
      : post.operations?.hasReacted || hasOptimisticallyCollected(post.id)
  );

  const { cache } = useApolloClient();

  const endTimestamp = collectAction?.endsAt;
  const collectLimit = collectAction?.collectLimit;
  const amount = collectAction?.amount as number;
  const assetAddress = collectAction?.assetAddress as any;
  const assetDecimals = collectAction?.assetDecimals as number;
  const isAllCollected = collectLimit
    ? countOpenActions >= collectLimit
    : false;
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const canCollect = !hasActed || !amount;

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      collectOn: post?.id,
      txHash,
      type: OptimisticTxType.CREATE_COLLECT
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
    address: sessionAccountAddress as Address,
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

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted,
        onError
      });
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
              selected: true
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
        message={<NoBalanceError assetSymbol={collectAction?.assetSymbol} />}
      />
    );
  }

  return (
    <Button
      className="mt-5 w-full justify-center"
      disabled={isLoading}
      onClick={handleCreateCollect}
    >
      Collect now
    </Button>
  );
};

export default CollectActionButton;
