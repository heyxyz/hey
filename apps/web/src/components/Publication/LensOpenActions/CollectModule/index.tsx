import AllowanceButton from '@components/Settings/Allowance/Button';
import CollectWarning from '@components/Shared/CollectWarning';
import CountdownTimer from '@components/Shared/CountdownTimer';
import Collectors from '@components/Shared/Modal/Collectors';
import NoBalanceError from '@components/Shared/NoBalanceError';
import Slug from '@components/Shared/Slug';
import {
  BanknotesIcon,
  ClockIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY, POLYGONSCAN_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
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
  FollowModuleType,
  useActOnOpenActionMutation,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useCreateLegacyCollectTypedDataMutation,
  useLegacyCollectMutation
} from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getProfile from '@hey/lib/getProfile';
import getSignature from '@hey/lib/getSignature';
import getTokenImage from '@hey/lib/getTokenImage';
import humanize from '@hey/lib/humanize';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Button, Modal, Spinner, Tooltip, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getOpenActionActOnKey from '@lib/getOpenActionActOnKey';
import getRedstonePrice from '@lib/getRedstonePrice';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import plur from 'plur';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useOpenActionOptimisticStore } from 'src/store/OptimisticActions/useOpenActionOptimisticStore';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useSignTypedData
} from 'wagmi';

import Splits from './Splits';

interface CollectModuleProps {
  publication: AnyPublication;
  openAction: OpenActionModule;
}

const CollectModule: FC<CollectModuleProps> = ({ publication, openAction }) => {
  const {
    setOpenActionPublicationConfig,
    hasActedByMe,
    getOpenActionCountByPublicationId
  } = useOpenActionOptimisticStore();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [isLoading, setIsLoading] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const openActionCount = getOpenActionCountByPublicationId(
    targetPublication.id
  );
  const hasActed = hasActedByMe(targetPublication.id);

  const collectModule = openAction as
    | SimpleCollectOpenActionSettings
    | MultirecipientFeeCollectOpenActionSettings
    | LegacySimpleCollectModuleSettings
    | LegacyMultirecipientFeeCollectModuleSettings;

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = parseInt(collectModule?.collectLimit || '0');
  const amount = parseFloat(collectModule?.amount?.value || '0');
  const currency = collectModule?.amount?.asset?.symbol;
  const assetAddress = collectModule?.amount?.asset?.contract.address;
  const assetDecimals = collectModule?.amount?.asset?.decimals;
  const referralFee = collectModule?.referralFee;
  const isLimitedCollectAllCollected = collectLimit
    ? openActionCount >= collectLimit
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
  const isMultirecipientFeeCollectModule =
    collectModule.__typename === 'MultirecipientFeeCollectOpenActionSettings';
  const canUseLensManager = !collectModule?.followerOnly && isFreeCollectModule;

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setOpenActionPublicationConfig(targetPublication.id, {
      countOpenActions: openActionCount + 1,
      acted: true
    });
    toast.success('Collected successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      publication_id: targetPublication?.id,
      collect_module: collectModule?.type
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: isLegacyCollectModule ? 'collectLegacy' : 'act',
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    }
  });

  const percentageCollected = (openActionCount / collectLimit) * 100;

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
      skip: !assetAddress || !currentProfile,
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      }
    });

  const { data: usdPrice } = useQuery({
    queryKey: ['getRedstonePrice', currency],
    queryFn: async () => await getRedstonePrice(getAssetSymbol(currency)),
    enabled: Boolean(amount)
  });

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
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

  // Act Typed Data
  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
      onError
    });

  // Legacy Collect Typed Data
  const [createLegacyCollectTypedData] =
    useCreateLegacyCollectTypedDataMutation({
      onCompleted: async ({ createLegacyCollectTypedData }) => {
        const { id, typedData } = createLegacyCollectTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
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
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      if (isLegacyCollectModule) {
        const legcayCollectRequest: LegacyCollectRequest = {
          on: targetPublication?.id
        };

        if (canUseLensManager) {
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

      if (canUseLensManager) {
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

  return (
    <>
      {Boolean(collectLimit) ? (
        <Tooltip
          placement="top"
          content={`${percentageCollected.toFixed(0)}% Collected`}
        >
          <div className="h-2.5 w-full rounded-t-xl bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2.5 rounded-t-xl"
              style={{ width: `${percentageCollected}%` }}
            />
          </div>
        </Tooltip>
      ) : null}
      <div className="p-5">
        {collectModule?.followerOnly ? (
          <div className="pb-5">
            <CollectWarning
              handle={getProfile(publication.by).slugWithPrefix}
              isSuperFollow={
                publication?.by?.followModule?.type ===
                FollowModuleType.FeeFollowModule
              }
            />
          </div>
        ) : null}
        <div className="mb-4">
          <div className="text-xl font-bold">
            {targetPublication.__typename} by{' '}
            <Slug slug={getProfile(targetPublication.by).slugWithPrefix} />
          </div>
        </div>
        {amount ? (
          <div className="flex items-center space-x-1.5 py-2">
            <img
              className="h-7 w-7"
              height={28}
              width={28}
              src={getTokenImage(currency)}
              alt={currency}
              title={currency}
            />
            <span className="space-x-1">
              <span className="text-2xl font-bold">{amount}</span>
              <span className="text-xs">{currency}</span>
              {usdPrice ? (
                <>
                  <span className="lt-text-gray-500 px-0.5">·</span>
                  <span className="lt-text-gray-500 text-xs font-bold">
                    ${(amount * usdPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="block items-center space-y-1 sm:flex sm:space-x-5">
            <div className="flex items-center space-x-2">
              <UsersIcon className="lt-text-gray-500 h-4 w-4" />
              <button
                className="font-bold"
                type="button"
                onClick={() => setShowCollectorsModal(!showCollectorsModal)}
              >
                {humanize(openActionCount)} {plur('collector', openActionCount)}
              </button>
              <Modal
                title="Collected by"
                icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
                show={showCollectorsModal}
                onClose={() => setShowCollectorsModal(false)}
              >
                <Collectors publicationId={targetPublication.id} />
              </Modal>
            </div>
            {collectLimit ? (
              <div className="flex items-center space-x-2">
                <PhotoIcon className="lt-text-gray-500 h-4 w-4" />
                <div className="font-bold">
                  {collectLimit - openActionCount} available
                </div>
              </div>
            ) : null}
            {referralFee ? (
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="lt-text-gray-500 h-4 w-4" />
                <div className="font-bold">{referralFee}% referral fee</div>
              </div>
            ) : null}
          </div>
          {endTimestamp ? (
            <div className="flex items-center space-x-2">
              <ClockIcon className="lt-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Sale Ends:</span>
                <span className="font-bold text-gray-600">
                  <CountdownTimer targetDate={endTimestamp} />
                </span>
              </div>
            </div>
          ) : null}
          {collectModule.contract.address ? (
            <div className="flex items-center space-x-2">
              <PuzzlePieceIcon className="lt-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <Link
                  href={`${POLYGONSCAN_URL}/token/${collectModule.contract.address}`}
                  target="_blank"
                  className="font-bold text-gray-600"
                  rel="noreferrer noopener"
                >
                  {formatAddress(collectModule.contract.address)}
                </Link>
              </div>
            </div>
          ) : null}
          {isMultirecipientFeeCollectModule ? (
            <Splits recipients={collectModule?.recipients} />
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          {currentProfile &&
          (!hasActed ||
            (!isFreeCollectModule && !isSimpleFreeCollectModule)) ? (
            allowanceLoading || balanceLoading ? (
              <div className="shimmer mt-5 h-[34px] w-28 rounded-lg" />
            ) : allowed ? (
              hasAmount ? (
                !isLimitedCollectAllCollected && !isCollectExpired ? (
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
                ) : null
              ) : (
                <WarningMessage
                  className="mt-5 w-full"
                  message={
                    <NoBalanceError moduleAmount={collectModule.amount} />
                  }
                />
              )
            ) : (
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
            )
          ) : null}
        </div>
        {targetPublication.operations.hasActed.value ? (
          <div className="mt-3 flex items-center space-x-1.5 font-bold text-green-500">
            <CheckCircleIcon className="h-5 w-5" />
            <div>You already collected this</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CollectModule;
