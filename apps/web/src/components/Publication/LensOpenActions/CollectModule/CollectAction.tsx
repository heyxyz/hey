import { useApolloClient } from '@apollo/client';
import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { LensHub, PublicAct } from '@hey/abis';
import { LENSHUB_PROXY, PUBLICACT_PROXY } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type {
  ActOnOpenActionLensManagerRequest,
  AnyPublication,
  ApprovedAllowanceAmountResult,
  LegacyCollectRequest,
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  OpenActionModule,
  SimpleCollectOpenActionSettings
} from '@hey/lens';
import {
  useActOnOpenActionMutation,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useCreateLegacyCollectTypedDataMutation,
  useLegacyCollectMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getOpenActionActOnKey from '@hey/lib/getOpenActionActOnKey';
import getSignature from '@hey/lib/getSignature';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Button, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getCurrentSession from '@lib/getCurrentSession';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { isAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useSignTypedData
} from 'wagmi';

interface CollectActionProps {
  publication: AnyPublication;
  openAction: OpenActionModule;
  countOpenActions: number;
  setCountOpenActions: (count: number) => void;
}

const CollectAction: FC<CollectActionProps> = ({
  publication,
  openAction,
  countOpenActions,
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
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const collectModule = openAction as
    | SimpleCollectOpenActionSettings
    | MultirecipientFeeCollectOpenActionSettings
    | LegacySimpleCollectModuleSettings
    | LegacyMultirecipientFeeCollectModuleSettings;

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = parseInt(collectModule?.collectLimit || '0');
  const amount = parseFloat(collectModule?.amount?.value || '0');
  const assetAddress = collectModule?.amount?.asset?.contract.address;
  const assetDecimals = collectModule?.amount?.asset?.decimals;
  const isAllCollected = collectLimit
    ? countOpenActions >= collectLimit
    : false;
  const isCollectExpired = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const isLegacyCollectModule =
    collectModule.__typename === 'LegacySimpleCollectModuleSettings' ||
    collectModule.__typename === 'LegacyMultirecipientFeeCollectModuleSettings';
  const isFreeCollectModule = !amount;
  const isSimpleFreeCollectModule =
    collectModule.__typename === 'SimpleCollectOpenActionSettings';
  const isFollowersOnly = collectModule?.followerOnly;
  const canUseManager =
    canUseLensManager && !collectModule?.followerOnly && isFreeCollectModule;

  const canCollect =
    !hasActed || (!isFreeCollectModule && !isSimpleFreeCollectModule);

  const updateCache = () => {
    cache.modify({
      id: cache.identify(targetPublication),
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasActed: { value: !hasActed } };
        }
      }
    });
    cache.modify({
      id: cache.identify(targetPublication.stats),
      fields: {
        countOpenActions: () =>
          hasActed ? countOpenActions - 1 : countOpenActions + 1
      }
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
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
      publication_id: targetPublication?.id,
      collect_module: collectModule?.type
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const walletUserFunctionName = 'publicCollect';
  const profileUserFunctionName = isLegacyCollectModule
    ? 'collectLegacy'
    : 'act';

  const { write } = useContractWrite({
    address: isWalletUser ? PUBLICACT_PROXY : LENSHUB_PROXY,
    abi: (isWalletUser ? PublicAct : LensHub) as any,
    functionName: isWalletUser
      ? walletUserFunctionName
      : profileUserFunctionName,
    onSuccess: () => {
      onCompleted();
      if (!isWalletUser) {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      }
    },
    onError: (error) => {
      onError(error);
      if (!isWalletUser) {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
      }
    }
  });

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      variables: {
        request: {
          currencies: assetAddress,
          followModules: [],
          openActionModules: [collectModule?.type],
          referenceModules: []
        }
      },
      skip: !assetAddress || !sessionProfileId,
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      }
    });

  const { data: balanceData } = useBalance({
    address,
    token: assetAddress,
    formatUnits: assetDecimals,
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
    const signature = await signTypedDataAsync(getSignature(typedData));
    setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

    if (canBroadcast) {
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        return write({ args: [typedData.value] });
      }
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
        for: targetPublication?.id,
        actOn: { [getOpenActionActOnKey(collectModule?.type)]: true }
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
          title="Allow collect module"
          module={
            allowanceData
              ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
          }
          allowed={allowed}
          setAllowed={setAllowed}
        />
      </span>
    );
  }

  if (!hasAmount) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={<NoBalanceError moduleAmount={collectModule.amount} />}
      />
    );
  }

  return (
    <Button
      className="mt-5"
      onClick={createCollect}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner size="xs" />
        ) : (
          <RectangleStackIcon className="h-4 w-4" />
        )
      }
    >
      Collect now
    </Button>
  );
};

export default CollectAction;
