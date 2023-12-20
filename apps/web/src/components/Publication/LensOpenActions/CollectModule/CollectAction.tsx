import type {
  ActOnOpenActionLensManagerRequest,
  AnyPublication,
  ApprovedAllowanceAmountResult,
  LegacyCollectRequest,
  OpenActionModule
} from '@hey/lens';
import type { FC } from 'react';

import { useApolloClient } from '@apollo/client';
import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { LensHub, PublicAct } from '@hey/abis';
import { LENSHUB_PROXY, PUBLICACT_PROXY } from '@hey/data/constants';
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
import { Button, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getCurrentSession from '@lib/getCurrentSession';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { isAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useSignTypedData
} from 'wagmi';

interface CollectActionProps {
  countOpenActions: number;
  openAction: OpenActionModule;
  publication: AnyPublication;
  setCountOpenActions: (count: number) => void;
}

const CollectAction: FC<CollectActionProps> = ({
  countOpenActions,
  openAction,
  publication,
  setCountOpenActions
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const { id: sessionProfileId } = getCurrentSession();
  const isWalletUser = isAddress(sessionProfileId);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [isLoading, setIsLoading] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [hasActed, setHasActed] = useState(
    targetPublication.operations.hasActed.value
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
  const assetDecimals = collectModule?.assetDecimals;
  const isAllCollected = collectLimit
    ? countOpenActions >= collectLimit
    : false;
  const isCollectExpired = endTimestamp
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
  const canUseManager =
    canUseLensManager && !collectModule?.followerOnly && isFreeCollectModule;

  const canCollect =
    !hasActed || (!isFreeCollectModule && !isSimpleFreeCollectModule);

  const updateCache = () => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasActed: { value: !hasActed } };
        }
      },
      id: cache.identify(targetPublication)
    });
    cache.modify({
      fields: {
        countOpenActions: () =>
          hasActed ? countOpenActions - 1 : countOpenActions + 1
      },
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
    setCountOpenActions(countOpenActions + 1);
    updateCache();
    toast.success('Collected successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      collect_module: openAction?.type,
      publication_id: targetPublication?.id
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const walletUserFunctionName = 'publicCollect';
  const profileUserFunctionName = isLegacyCollectModule
    ? 'collectLegacy'
    : 'act';

  const { write } = useContractWrite({
    abi: (isWalletUser ? PublicAct : LensHub) as any,
    address: isWalletUser ? PUBLICACT_PROXY : LENSHUB_PROXY,
    functionName: isWalletUser
      ? walletUserFunctionName
      : profileUserFunctionName,
    onError: (error) => {
      onError(error);
      if (!isWalletUser) {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
      }
    },
    onSuccess: () => {
      onCompleted();
      if (!isWalletUser) {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      }
    }
  });

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
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
    formatUnits: assetDecimals,
    token: assetAddress,
    watch: true
  });

  let hasAmount = false;
  if (balanceData && parseFloat(balanceData?.formatted) < amount) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;

    if (canBroadcast) {
      const signature = await signTypedDataAsync(getSignature(typedData));
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        return write({ args: [typedData.value] });
      }
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

      return;
    }

    return write?.({ args: [typedData.value] });
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
    onCompleted: ({ actOnOpenAction }) =>
      onCompleted(actOnOpenAction.__typename),
    onError
  });

  // Legacy Collect
  const [legacyCollect] = useLegacyCollectMutation({
    onCompleted: ({ legacyCollect }) => onCompleted(legacyCollect.__typename),
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
    if (handleWrongNetwork()) {
      return;
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

  if (isAllCollected || isCollectExpired) {
    return null;
  }

  if (isWalletUser && isFollowersOnly) {
    return null;
  }

  if (allowanceLoading) {
    return <div className="shimmer mt-5 h-[34px] w-28 rounded-lg" />;
  }

  if (!allowed) {
    return (
      <span className="mt-5">
        <AllowanceButton
          allowed={allowed}
          module={
            allowanceData
              ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
          }
          setAllowed={setAllowed}
          title="Allow collect module"
        />
      </span>
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
        message={<NoBalanceError moduleAmount={openAction.amount} />}
      />
    );
  }

  return (
    <Button
      className="mt-5"
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
      Collect now
    </Button>
  );
};

export default CollectAction;
