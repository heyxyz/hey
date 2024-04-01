import type {
  ActOnOpenActionLensManagerRequest,
  AnyPublication,
  ApprovedAllowanceAmountResult,
  LegacyCollectRequest,
  OpenActionModule
} from '@hey/lens';
import type { FC, ReactNode } from 'react';

import { useApolloClient } from '@apollo/client';
import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import FollowUnfollowButton from '@components/Shared/Profile/FollowUnfollowButton';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { Errors } from '@hey/data';
import { LENS_HUB } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import {
  useActOnOpenActionMutation,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useCreateLegacyCollectTypedDataMutation,
  useLegacyCollectMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getCollectModuleData from '@hey/lib/getCollectModuleData';
import getOpenActionActOnKey from '@hey/lib/getOpenActionActOnKey';
import getSignature from '@hey/lib/getSignature';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Button, Spinner, WarningMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import getCurrentSession from '@lib/getCurrentSession';
import { Leafwatch } from '@lib/leafwatch';
import hasOptimisticallyCollected from '@lib/optimistic/hasOptimisticallyCollected';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
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
  publication: AnyPublication;
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
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
  const { addTransaction } = useTransactionStore();

  const { id: sessionProfileId } = getCurrentSession();

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [isLoading, setIsLoading] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [hasActed, setHasActed] = useState(
    targetPublication.operations.hasActed.value ||
      hasOptimisticallyCollected(targetPublication.id)
  );
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  // Lens manager
  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const collectModule = getCollectModuleData(openAction as any);

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
  const isLegacyCollectModule =
    openAction.__typename === 'LegacySimpleCollectModuleSettings' ||
    openAction.__typename === 'LegacyMultirecipientFeeCollectModuleSettings' ||
    openAction.__typename === 'LegacyFreeCollectModuleSettings' ||
    openAction.__typename === 'LegacyFeeCollectModuleSettings' ||
    openAction.__typename === 'LegacyLimitedFeeCollectModuleSettings' ||
    openAction.__typename === 'LegacyTimedFeeCollectModuleSettings' ||
    openAction.__typename === 'LegacyLimitedTimedFeeCollectModuleSettings';
  const isFreeCollectModule = !amount;
  const isSimpleFreeCollectModule =
    openAction.__typename === 'SimpleCollectOpenActionSettings';
  const isFollowersOnly = collectModule?.followerOnly;
  const isFollowedByMe = isFollowersOnly
    ? targetPublication?.by.operations.isFollowedByMe.value
    : true;
  const isFollowFinalizedOnchain = isFollowersOnly
    ? targetPublication?.by.operations.isFollowedByMe.isFinalisedOnchain
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
  }) => {
    return {
      collectOn: targetPublication?.id,
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
      id: cache.identify(targetPublication)
    });
    cache.modify({
      fields: { countOpenActions: () => countOpenActions + 1 },
      id: cache.identify(targetPublication.stats)
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

    setHasActed(true);
    setIsLoading(false);
    onCollectSuccess?.();
    updateCache();
    toast.success('Collected successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      collect_module: openAction?.type,
      publication_id: targetPublication?.id
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const profileUserFunctionName = isLegacyCollectModule
    ? 'collectLegacy'
    : 'act';

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: (hash: string) => {
        onCompleted();
        incrementLensHubOnchainSigNonce();
        addTransaction(generateOptimisticCollect({ txHash: hash }));
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: profileUserFunctionName
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

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
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
  };

  // Act Typed Data
  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) =>
        await typedDataGenerator(createActOnOpenActionTypedData),
      onError
    });

  // Legacy Collect Typed Data
  const [createLegacyCollectTypedData] =
    useCreateLegacyCollectTypedDataMutation({
      onCompleted: async ({ createLegacyCollectTypedData }) =>
        await typedDataGenerator(createLegacyCollectTypedData),
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

  // Legacy Collect
  const [legacyCollect] = useLegacyCollectMutation({
    onCompleted: ({ legacyCollect }) => {
      if (legacyCollect.__typename === 'RelaySuccess') {
        addTransaction(generateOptimisticCollect({ txId: legacyCollect.txId }));
      }
      onCompleted(legacyCollect.__typename);
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

  // Collect via Lens Manager
  const legacyCollectViaLensManager = async (request: LegacyCollectRequest) => {
    const { data, errors } = await legacyCollect({ variables: { request } });

    if (errors?.toString().includes('has already collected on')) {
      return;
    }

    if (
      !data?.legacyCollect ||
      data?.legacyCollect.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createLegacyCollectTypedData({ variables: { request } });
    }
  };

  const createCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      if (isLegacyCollectModule) {
        const legcayCollectRequest: LegacyCollectRequest = {
          on: targetPublication?.id
        };

        if (canUseManager) {
          return await legacyCollectViaLensManager(legcayCollectRequest);
        }

        return await createLegacyCollectTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: legcayCollectRequest
          }
        });
      }

      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { [getOpenActionActOnKey(openAction.type)]: true },
        for: targetPublication?.id
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
      <div className="mt-5">
        <LoginButton title="Login to Collect" />
      </div>
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
      <div className={cn('shimmer mt-5 h-[34px] w-28 rounded-lg', className)} />
    );
  }

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        className={cn('mt-5', className)}
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
      openAction.__typename === 'LegacySimpleCollectModuleSettings' ||
      openAction.__typename === 'MultirecipientFeeCollectOpenActionSettings' ||
      openAction.__typename === 'LegacyMultirecipientFeeCollectModuleSettings')
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
      <div className="mt-5">
        <FollowUnfollowButton
          followTitle="Follow to Collect"
          profile={targetPublication.by}
        />
      </div>
    );
  }

  if (!isFollowFinalizedOnchain) {
    return (
      <div className="mt-5">
        <Button disabled outline>
          Follow finalizing onchain...
        </Button>
      </div>
    );
  }

  return (
    <Button
      className={cn('mt-5', className)}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner size="xs" />
        ) : (
          <RectangleStackIcon className="size-4" />
        )
      }
      onClick={createCollect}
    >
      {buttonTitle}
    </Button>
  );
};

export default CollectAction;
