import { useApolloClient } from "@apollo/client";
import LoginButton from "@components/Shared/LoginButton";
import NoBalanceError from "@components/Shared/NoBalanceError";
import errorToast from "@helpers/errorToast";
import { COLLECT_FEES_WALLET } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import getCollectActionData from "@hey/helpers/getCollectActionData";
import {
  type LoggedInPostOperations,
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
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { type Address, formatUnits } from "viem";
import { useBalance } from "wagmi";

interface CollectActionButtonProps {
  collects: number;
  onCollectSuccess?: () => void;
  postAction: PostAction;
  post: Post;
}

const CollectActionButton: FC<CollectActionButtonProps> = ({
  collects,
  onCollectSuccess = () => {},
  postAction,
  post
}) => {
  const collectAction = getCollectActionData(postAction as any);
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSimpleCollected, setHasSimpleCollected] = useState(
    collectAction?.amount ? false : post.operations?.hasSimpleCollected
  );
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const endTimestamp = collectAction?.endsAt;
  const collectLimit = collectAction?.collectLimit;
  const amount = collectAction?.amount as number;
  const assetAddress = collectAction?.assetAddress as any;
  const assetDecimals = collectAction?.assetDecimals as number;
  const isAllCollected = collectLimit ? collects >= collectLimit : false;
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const canCollect = !hasSimpleCollected;

  const updateCache = () => {
    cache.modify({
      fields: { hasSimpleCollected: () => true },
      id: cache.identify(post.operations as LoggedInPostOperations)
    });
    cache.modify({
      fields: {
        stats: (existingData) => ({
          ...existingData,
          collects: collects + 1
        })
      },
      id: cache.identify(post)
    });
  };

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.CREATE_COLLECT);
    // Should not disable the button if it's a paid collect module
    setHasSimpleCollected(amount <= 0);
    setIsLoading(false);
    onCollectSuccess?.();
    updateCache();
    toast.success("Collected successfully");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data: balanceData } = useBalance({
    address: currentAccount?.address as Address,
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
              selected: true,
              referrals: [{ address: COLLECT_FEES_WALLET, percent: 5 }]
            }
          }
        }
      }
    });
  };

  if (!currentAccount) {
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
