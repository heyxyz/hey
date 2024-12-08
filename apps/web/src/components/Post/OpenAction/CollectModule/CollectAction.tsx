import { useApolloClient } from "@apollo/client";
import AllowanceButton from "@components/Settings/Allowance/Button";
import FollowUnfollowButton from "@components/Shared/Account/FollowUnfollowButton";
import LoginButton from "@components/Shared/LoginButton";
import NoBalanceError from "@components/Shared/NoBalanceError";
import errorToast from "@helpers/errorToast";
import getCurrentSession from "@helpers/getCurrentSession";
import { Errors } from "@hey/data/errors";
import getCollectModuleData from "@hey/helpers/getCollectModuleData";
import getPostActionActOnKey from "@hey/helpers/getPostActionActOnKey";
import type { Post, PostAction } from "@hey/indexer";
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
import { useAccount, useBalance } from "wagmi";

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
  onCollectSuccess = () => {},
  postAction,
  post
}) => {
  const collectModule = getCollectModuleData(postAction as any);
  const { address: sessionAccountAddress } = getCurrentSession();

  const { isSuspended } = useAccountStatus();
  const { isFollowPending, hasOptimisticallyCollected } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [hasActed, setHasActed] = useState(
    collectModule?.amount
      ? false
      : post.operations.hasActed.value || hasOptimisticallyCollected(post.id)
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
  const isSimpleFreeCollectModule =
    postAction.__typename === "SimpleCollectOpenActionSettings";
  const isFollowersOnly = collectModule?.followerOnly;
  const isFollowedByMe = isFollowersOnly
    ? post?.author.operations?.isFollowedByMe
    : true;
  const isFollowFinalizedOnchain = isFollowersOnly
    ? !isFollowPending(post.author.address)
    : true;

  const canCollect = forceShowCollect
    ? true
    : !hasActed || (!isFreeCollectModule && !isSimpleFreeCollectModule);

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

  const onCompleted = (
    __typename?: "LensProfileManagerRelayError" | "RelayError" | "RelaySuccess"
  ) => {
    if (
      __typename === "RelayError" ||
      __typename === "LensProfileManagerRelayError"
    ) {
      return;
    }

    // Should not disable the button if it's a paid collect module
    setHasActed(amount <= 0);
    setIsLoading(false);
    onCollectSuccess?.();
    updateCache();
    toast.success("Collected");
  };

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: "no-cache",
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        const allowedAmount = Number.parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      },
      skip: !assetAddress || !sessionAccountAddress,
      variables: {
        request: {
          currencies: assetAddress,
          followModules: [],
          openActionModules: [postAction.__typename],
          referenceModules: []
        }
      }
    });

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
  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) => {
      if (actOnOpenAction.__typename === "RelaySuccess") {
        updateTransactions({ txHash: actOnOpenAction.txHash });
      }
      onCompleted(actOnOpenAction.__typename);
    },
    onError
  });

  // Act via Lens Manager
  const actViaLensManager = async (
    request: ActOnOpenActionLensManagerRequest
  ) => {
    const { data, errors } = await actOnOpenAction({ variables: { request } });

    if (errors?.toString().includes("has already acted on")) {
      return;
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === "LensProfileManagerRelayError"
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } });
    }
  };

  const handleCreateCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { [getPostActionActOnKey(postAction.__typename)]: true },
        for: post?.id
      };

      return await createActOnOpenActionTypedData({
        variables: { request: actOnRequest }
      });
    } catch (error) {
      onError(error);
    }
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

  if (allowanceLoading) {
    return (
      <div
        className={cn("shimmer mt-5 h-[34px] w-full rounded-full", className)}
      />
    );
  }

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        className={cn("mt-5 w-full", className)}
        module={
          allowanceData
            ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
        }
        setAllowed={setAllowed}
        title="Allow collect module"
      />
    );
  }

  if (
    !hasAmount &&
    (postAction.__typename === "SimpleCollectActionSettings" ||
      postAction.__typename === "MultirecipientFeeCollectOpenActionSettings")
  ) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={
          <NoBalanceError
            errorMessage={noBalanceErrorMessages}
            moduleAmount={postAction.amount}
          />
        }
      />
    );
  }

  if (!isFollowedByMe) {
    return (
      <FollowUnfollowButton
        buttonClassName="w-full mt-5"
        followTitle="Follow to collect"
        account={post.author}
      />
    );
  }

  if (!isFollowFinalizedOnchain) {
    return (
      <Button className="mt-5 w-full" disabled outline>
        Follow finalizing onchain...
      </Button>
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
