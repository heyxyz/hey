import type {
  ActOnOpenActionLensManagerRequest,
  ApprovedAllowanceAmountResult,
  MirrorablePublication,
  OpenActionModule
} from '@hey/lens';
import type { OptimisticTransaction } from '@hey/types/misc';
import type { FC, ReactNode } from 'react';

import { useApolloClient } from '@apollo/client';
import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import FollowUnfollowButton from '@components/Shared/Profile/FollowUnfollowButton';
import errorToast from '@helpers/errorToast';
import getCurrentSession from '@helpers/getCurrentSession';
import { Leafwatch } from '@helpers/leafwatch';
import hasOptimisticallyCollected from '@helpers/optimistic/hasOptimisticallyCollected';
import { LensHub } from '@hey/abis';
import { Errors } from '@hey/data';
import { LENS_HUB } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import checkDispatcherPermissions from '@hey/helpers/checkDispatcherPermissions';
import getCollectModuleData from '@hey/helpers/getCollectModuleData';
import getOpenActionActOnKey from '@hey/helpers/getOpenActionActOnKey';
import getSignature from '@hey/helpers/getSignature';
import {
  useActOnOpenActionMutation,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation
} from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Button, WarningMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import { formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useSignTypedData,
  useWriteContract
} from 'wagmi';

interface CollectActionProps {
  buttonTitle?: string;
  className?: string;
  countOpenActions: number;
  forceShowCollect?: boolean;
  noBalanceErrorMessages?: ReactNode;
  onCollectSuccess?: () => void;
  openAction: OpenActionModule;
  publication: MirrorablePublication;
}

const CollectAction: FC<CollectActionProps> = ({
  buttonTitle = 'Collect now',
  className = '',
  countOpenActions,
  forceShowCollect = false,
  noBalanceErrorMessages,
  onCollectSuccess = () => {},
  openAction,
  publication
}) => {
  const collectModule = getCollectModuleData(openAction as any);

  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
  const { addTransaction, isFollowPending } = useTransactionStore();

  const { id: sessionProfileId } = getCurrentSession();

  const [isLoading, setIsLoading] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [hasActed, setHasActed] = useState(
    collectModule?.amount || 0 > 0
      ? false
      : publication.operations.hasActed.value ||
          hasOptimisticallyCollected(publication.id)
  );

  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  // Lens manager
  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

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
    openAction.__typename === 'SimpleCollectOpenActionSettings';
  const isFollowersOnly = collectModule?.followerOnly;
  const isFollowedByMe = isFollowersOnly
    ? publication?.by.operations.isFollowedByMe.value
    : true;
  const isFollowFinalizedOnchain = isFollowersOnly
    ? !isFollowPending(publication.by.id)
    : true;

  const canUseManager =
    canUseLensManager && !isFollowersOnly && isFreeCollectModule;
  const canCollect = forceShowCollect
    ? true
    : !hasActed || (!isFreeCollectModule && !isSimpleFreeCollectModule);

  const generateOptimisticCollect = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }): OptimisticTransaction => {
    return {
      collectOn: publication?.id,
      txHash,
      txId,
      type: OptmisticPublicationType.Collect
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasActed: { value: true } };
        }
      },
      id: cache.identify(publication)
    });
    cache.modify({
      fields: { countOpenActions: () => countOpenActions + 1 },
      id: cache.identify(publication.stats)
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    // Should not disable the button if it's a paid collect module
    setHasActed(amount > 0 ? false : true);
    setIsLoading(false);
    onCollectSuccess?.();
    updateCache();
    toast.success('Collected successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      amount,
      collect_module: openAction?.type,
      publication_id: publication?.id
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticCollect({ txHash: hash }));
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
      functionName: 'act'
    });
  };

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      },
      skip: !assetAddress || !sessionProfileId,
      variables: {
        request: {
          currencies: assetAddress,
          followModules: [],
          openActionModules: [openAction.type],
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
    parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        addTransaction(
          generateOptimisticCollect({ txId: broadcastOnchain.txId })
        );
      }
      onCompleted(broadcastOnchain.__typename);
    }
  });

  // Act Typed Data
  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData;
        await handleWrongNetwork();

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args: [typedData.value] });
          }
          incrementLensHubOnchainSigNonce();

          return;
        }

        return await write({ args: [typedData.value] });
      },
      onError
    });

  // Act
  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) => {
      if (actOnOpenAction.__typename === 'RelaySuccess') {
        addTransaction(
          generateOptimisticCollect({ txId: actOnOpenAction.txId })
        );
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

    if (errors?.toString().includes('has already acted on')) {
      return;
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } });
    }
  };

  const createCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { [getOpenActionActOnKey(openAction.type)]: true },
        for: publication?.id
      };

      if (canUseManager) {
        return await actViaLensManager(actOnRequest);
      }

      return await createActOnOpenActionTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: actOnRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (!sessionProfileId) {
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
        className={cn('shimmer mt-5 h-[34px] w-full rounded-full', className)}
      />
    );
  }

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        className={cn('mt-5 w-full', className)}
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
    (openAction.__typename === 'SimpleCollectOpenActionSettings' ||
      openAction.__typename === 'MultirecipientFeeCollectOpenActionSettings')
  ) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={
          <NoBalanceError
            errorMessage={noBalanceErrorMessages}
            moduleAmount={openAction.amount}
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
        profile={publication.by}
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
      className={cn('mt-5 w-full justify-center', className)}
      disabled={isLoading}
      onClick={createCollect}
    >
      {buttonTitle}
    </Button>
  );
};

export default CollectAction;
